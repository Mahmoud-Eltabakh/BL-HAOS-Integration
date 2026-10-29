import { existsSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function loadHostEnvironment() {
  if (process.env.DEBUG || process.env.PWDEBUG) throw new Error('Host prerequisites: debug payload output must be disabled');
  return validateHostEnvironment(process.env, fileURLToPath(new URL('../../../../', import.meta.url)));
}

const filesystem = {
  absolute: path.isAbsolute,
  canonical: realpathSync,
  relative: path.relative,
  isFile: (value) => statSync(value).isFile(),
  identity: (value) => {
    const stat = statSync(value, { bigint: true });
    return `${stat.dev}:${stat.ino}`;
  },
  inRepository: (value) => {
    let directory = path.dirname(value);
    while (true) {
      if (existsSync(path.join(directory, '.git'))) return true;
      const parent = path.dirname(directory);
      if (parent === directory) return false;
      directory = parent;
    }
  },
};

export function validateHostEnvironment(env, workspace, files = filesystem) {
  const fail = (reason) => { throw new Error(`Host prerequisites: ${reason}`); };
  const required = (key) => {
    const value = env[key];
    if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f\u007f]/.test(value)) fail(`${key} is required`);
    return value;
  };
  const baseURL = required('BLHAOS_HA_URL');
  let host;
  try { host = new URL(baseURL); } catch { fail('BLHAOS_HA_URL must be a credential-free HTTP(S) origin'); }
  if (!['http:', 'https:'].includes(host.protocol) || host.username || host.password
    || host.pathname !== '/' || host.search || host.hash || baseURL.replace(/\/$/, '') !== host.origin) {
    fail('BLHAOS_HA_URL must be a credential-free HTTP(S) origin');
  }
  const dashboardPath = required('BLHAOS_HA_DASHBOARD_PATH');
  let dashboard;
  try { dashboard = new URL(dashboardPath, host.origin); } catch { fail('BLHAOS_HA_DASHBOARD_PATH must be a local dashboard path'); }
  if (!dashboardPath.startsWith('/') || dashboardPath.startsWith('//') || /[?#\\]/.test(dashboardPath)
    || dashboard.origin !== host.origin || dashboard.pathname !== dashboardPath) {
    fail('BLHAOS_HA_DASHBOARD_PATH must be a local dashboard path without query or fragment');
  }
  const external = (key) => {
    const value = required(key);
    if (!files.absolute(value)) fail(`${key} must name an absolute external file`);
    try {
      const canonical = files.canonical(value);
      const root = files.canonical(workspace);
      const relative = files.relative(root.toLowerCase(), canonical.toLowerCase());
      const outside = /^\.\.(?:[\\/]|$)/.test(relative) || files.absolute(relative);
      if (!relative || !outside || !files.isFile(canonical) || files.inRepository(canonical)) {
        fail(`${key} must name an existing file outside the workspace`);
      }
      return canonical;
    } catch { fail(`${key} must name an existing file outside the workspace`); }
  };
  const storageState = external('BLHAOS_HA_STORAGE_STATE');
  const expiryStorageState = external('BLHAOS_HA_EXPIRY_STORAGE_STATE');
  if (storageState.toLowerCase() === expiryStorageState.toLowerCase()) fail('expiry fixture must be a separate disposable session');
  try {
    if (files.identity(storageState) === files.identity(expiryStorageState)) fail('expiry fixture must be a separate disposable session');
  } catch { fail('session fixtures must be distinct accessible external files'); }
  const target = required('BLHAOS_HA_TARGET');
  if (!/^media_player\.[a-z0-9_]+$/.test(target)) fail('BLHAOS_HA_TARGET must be one explicit media_player entity');
  const provider = required('BLHAOS_HA_PROVIDER_ID');
  const playlist = required('BLHAOS_HA_PLAYLIST_ID');
  if (![provider, playlist].every((value) => /^media-source:\/\/[^\s]+$/.test(value)) || provider === playlist) {
    fail('provider and playlist must be distinct original opaque media-source references');
  }
  if (required('BLHAOS_HA_ALLOW_PLAYBACK') !== 'I_AUTHORIZE_REAL_PLAYBACK') fail('explicit real-playback consent is required');
  if (required('BLHAOS_HA_EXPIRY_CONSENT') !== 'I_AUTHORIZE_DISPOSABLE_EXPIRY_OBSERVATION') fail('separate disposable expiry-fixture consent is required');
  if (required('BLHAOS_HA_EXPIRY_ATTESTATION') !== 'I_ATTEST_SEPARATE_DISPOSABLE_FIXTURE_IS_EXPIRED_READ_ONLY') fail('explicit expired read-only fixture attestation is required');
  return { baseURL: host.origin, dashboardPath, storageState, expiryStorageState, expiryAttested: true, target, provider, playlist };
}