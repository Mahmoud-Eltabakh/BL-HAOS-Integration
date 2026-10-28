import assert from 'node:assert/strict';
import { linkSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { classifyExpiryEvidence } from './expiry-evidence.mjs';
import { validateHostEnvironment } from './host-env.mjs';
import SafeReporter, { SCENARIO_IDS } from './safe-reporter.mjs';

const workspace = '/workspace';
const input = {
  BLHAOS_HA_URL: 'https://ha.example',
  BLHAOS_HA_STORAGE_STATE: '/external/disposable.json',
  BLHAOS_HA_TARGET: 'media_player.explicit_speaker',
  BLHAOS_HA_PROVIDER_ID: 'media-source://opaque/provider',
  BLHAOS_HA_PLAYLIST_ID: 'media-source://opaque/playlist',
  BLHAOS_HA_ALLOW_PLAYBACK: 'I_AUTHORIZE_REAL_PLAYBACK',
  BLHAOS_HA_EXPIRY_STORAGE_STATE: '/external/naturally-expiring.json',
  BLHAOS_HA_EXPIRY_CONSENT: 'I_AUTHORIZE_DISPOSABLE_EXPIRY_OBSERVATION',
  BLHAOS_HA_EXPIRY_ATTESTATION: 'I_ATTEST_SEPARATE_DISPOSABLE_FIXTURE_IS_EXPIRED_READ_ONLY',
};
const files = {
  absolute: (value) => value.startsWith('/'),
  canonical: (value) => value,
  relative: (root, value) => value === root ? '' : value.startsWith(`${root}/`) ? value.slice(root.length + 1) : `../${value}`,
  isFile: () => true,
  inRepository: () => false,
  identity: (value) => value,
};

test('accepts explicit external disposable fixtures without reading their contents', () => {
  const result = validateHostEnvironment(input, workspace, files);
  assert.equal(result.baseURL, input.BLHAOS_HA_URL);
  assert.equal(result.target, input.BLHAOS_HA_TARGET);
  assert.equal(result.playlist, input.BLHAOS_HA_PLAYLIST_ID);
});

for (const key of Object.keys(input)) {
  test(`hard-fails missing ${key}`, () => {
    const candidate = { ...input };
    delete candidate[key];
    assert.throws(() => validateHostEnvironment(candidate, workspace, files), /Host prerequisites:/);
  });
}

for (const value of ['https://user:secret@ha.example', 'https://ha.example/?token=secret', 'https://ha.example/path', 'https://ha.example/#secret', 'file:///external']) {
  test('rejects a non-origin or credential-bearing host without reflecting input', () => {
    assert.throws(() => validateHostEnvironment({ ...input, BLHAOS_HA_URL: value }, workspace, files), (error) => !error.message.includes('secret') && error.message.startsWith('Host prerequisites:'));
  });
}

test('rejects relative, missing and in-workspace browser-state files', () => {
  for (const value of ['relative.json', '/workspace/secret.json', workspace]) {
    assert.throws(() => validateHostEnvironment({ ...input, BLHAOS_HA_STORAGE_STATE: value }, workspace, files));
  }
  assert.throws(() => validateHostEnvironment(input, workspace, { ...files, isFile: () => false }));
});

test('canonical paths prevent symlink and case-insensitive containment bypass', () => {
  assert.throws(() => validateHostEnvironment(input, workspace, { ...files, canonical: (value) => value === input.BLHAOS_HA_STORAGE_STATE ? '/workspace/secret.json' : value }));
  assert.throws(() => validateHostEnvironment({ ...input, BLHAOS_HA_STORAGE_STATE: '/WORKSPACE/secret.json' }, workspace, files));
});

test('allows sibling directory but never the same expiry session file', () => {
  validateHostEnvironment({ ...input, BLHAOS_HA_STORAGE_STATE: '/workspace-external/disposable.json' }, workspace, files);
  assert.throws(() => validateHostEnvironment({ ...input, BLHAOS_HA_EXPIRY_STORAGE_STATE: input.BLHAOS_HA_STORAGE_STATE }, workspace, files));
});

test('rejects implicit targets, raw URLs, equal references and absent real-play consent', () => {
  for (const changes of [
    { BLHAOS_HA_TARGET: 'all' }, { BLHAOS_HA_PLAYLIST_ID: 'https://provider.example/media' },
    { BLHAOS_HA_PROVIDER_ID: 'provider-name' }, { BLHAOS_HA_PLAYLIST_ID: input.BLHAOS_HA_PROVIDER_ID },
    { BLHAOS_HA_ALLOW_PLAYBACK: 'true' }, { BLHAOS_HA_EXPIRY_CONSENT: 'true' }, { BLHAOS_HA_EXPIRY_ATTESTATION: 'true' },
  ]) assert.throws(() => validateHostEnvironment({ ...input, ...changes }, workspace, files));
});

test('dot-dot-prefixed children are still inside the workspace', () => {
  assert.throws(() => validateHostEnvironment({ ...input, BLHAOS_HA_STORAGE_STATE: '/workspace/..private/disposable.json' }, workspace, files));
});

test('rejects external fixtures inside another source checkout', () => {
  assert.throws(() => validateHostEnvironment(input, workspace, { ...files, inRepository: () => true }));
});

test('rejects hard-linked session fixtures without reading auth contents', () => {
  assert.throws(() => validateHostEnvironment(input, workspace, { ...files, identity: () => 'same-file' }));
});

test('accepted environment carries the explicit expired-fixture attestation', () => {
  assert.equal(validateHostEnvironment(input, workspace, files).expiryAttested, true);
});

test('real filesystem adapter resolves junctions, hard links and other checkouts', () => {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'blhaos-host-env-')));
  const workspaceDir = path.join(root, 'workspace');
  const external = path.join(root, 'external');
  const checkout = path.join(root, 'checkout');
  const alias = path.join(external, 'alias');
  try {
    for (const directory of [path.join(workspaceDir, 'private'), external, path.join(checkout, '.git')]) mkdirSync(directory, { recursive: true });
    const placeholder = (file) => { writeFileSync(file, '{}'); return file; };
    const shared = placeholder(path.join(external, 'shared.json'));
    const expiring = placeholder(path.join(external, 'expiring.json'));
    placeholder(path.join(workspaceDir, 'private', 'state.json'));
    placeholder(path.join(checkout, 'state.json'));
    const env = { ...input, BLHAOS_HA_STORAGE_STATE: shared, BLHAOS_HA_EXPIRY_STORAGE_STATE: expiring };
    assert.equal(validateHostEnvironment(env, workspaceDir).storageState, realpathSync(shared));
    symlinkSync(path.join(workspaceDir, 'private'), alias, 'junction');
    assert.throws(() => validateHostEnvironment({ ...env, BLHAOS_HA_STORAGE_STATE: path.join(alias, 'state.json') }, workspaceDir), /outside the workspace/);
    const hard = path.join(external, 'hard.json');
    linkSync(shared, hard);
    assert.throws(() => validateHostEnvironment({ ...env, BLHAOS_HA_EXPIRY_STORAGE_STATE: hard }, workspaceDir), /separate disposable session|distinct accessible/);
    assert.throws(() => validateHostEnvironment({ ...env, BLHAOS_HA_STORAGE_STATE: path.join(checkout, 'state.json') }, workspaceDir), /outside the workspace/);
  } finally {
    try { unlinkSync(alias); } catch { /* alias not created */ }
    rmSync(root, { recursive: true, force: true });
  }
});

const captureStdout = (run) => {
  const chunks = [];
  const original = process.stdout.write;
  process.stdout.write = (chunk) => { chunks.push(String(chunk)); return true; };
  try { run(); } finally { process.stdout.write = original; }
  return chunks.join('');
};

test('reporter prints only allowlisted static scenario ids and known statuses', () => {
  const reporter = new SafeReporter();
  for (const [title, id] of SCENARIO_IDS) {
    assert.equal(captureStdout(() => reporter.onTestEnd({ title }, { status: 'failed', error: { message: 'https://ha.example/?token=secret' } })), `HA catalog scenario ${id}: failed\n`);
  }
  const leaked = captureStdout(() => reporter.onTestEnd({ title: 'https://ha.example/?token=secret' }, { status: 'secret' }));
  assert.equal(leaked, 'HA catalog scenario unlisted: unknown\n');
});

test('every spec scenario title is allowlisted exactly once', () => {
  const spec = readFileSync(new URL('./catalog.spec.ts', import.meta.url), 'utf8');
  const titles = [...spec.matchAll(/^test\('([^']+)'/gm)].map((match) => match[1]);
  assert.deepEqual([...titles].sort(), [...SCENARIO_IDS.keys()].sort());
  assert.equal(new Set(SCENARIO_IDS.values()).size, SCENARIO_IDS.size);
});

const quiet = { accepted: 0, unauthorized: 0, forbidden: 0, tokenRejected: 0 };
const observe = (changes = {}) => ({ attested: true, pathname: '/bl-haos-media', hass: null, probe: null, ...changes, responses: { ...quiet, ...changes.responses } });

test('numeric connection loss alone is never expiry', () => {
  assert.equal(classifyExpiryEvidence(observe({ hass: { connected: false, user: true }, probe: { code: 3 } })), 'disconnected');
  assert.equal(classifyExpiryEvidence(observe({ hass: { connected: false, user: true } })), 'disconnected');
});

test('unauthorized on a live connection is denial only, even with attestation', () => {
  for (const attested of [true, false]) {
    assert.equal(classifyExpiryEvidence(observe({ attested, hass: { connected: true, user: true }, probe: { code: 'unauthorized' } })), 'denied');
  }
});

test('HA login page or HTTP auth rejection is expiry only for an attested fixture with no accepted calls', () => {
  for (const changes of [{ pathname: '/auth/authorize' }, { responses: { tokenRejected: 1 } }, { responses: { unauthorized: 1 } }]) {
    assert.equal(classifyExpiryEvidence(observe(changes)), 'expired');
    assert.equal(classifyExpiryEvidence(observe({ ...changes, attested: false })), 'denied');
    assert.equal(classifyExpiryEvidence(observe({ ...changes, attested: 'true' })), 'denied');
    assert.equal(classifyExpiryEvidence(observe({ ...changes, responses: { ...changes.responses, accepted: 1 } })), 'accepted');
  }
});

test('live HTTP auth rejection is denial without a probe error code', () => {
  for (const responses of [{ unauthorized: 1 }, { forbidden: 1 }, { tokenRejected: 1 }]) {
    assert.equal(classifyExpiryEvidence(observe({ hass: { connected: true, user: true }, responses })), 'denied');
  }
});

test('a live or accepting session defeats expiry', () => {
  assert.equal(classifyExpiryEvidence(observe({ hass: { connected: true, user: true } })), 'accepted');
  assert.equal(classifyExpiryEvidence(observe({ pathname: '/auth/authorize', probe: 'accepted' })), 'accepted');
});

test('permission denial is never proved expiry', () => {
  assert.equal(classifyExpiryEvidence(observe({ responses: { forbidden: 1 } })), 'denied');
});

test('missing hass off the exact public login path stays pending', () => {
  for (const pathname of ['/', '/bl-haos-media', '/auth/authorize/extra', '/AUTH/AUTHORIZE', undefined]) {
    assert.equal(classifyExpiryEvidence(observe({ pathname })), 'pending');
  }
});