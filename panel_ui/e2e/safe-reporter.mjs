export const SCENARIO_IDS = new Map([
  ['actual HA hierarchy, responsive shadow-root controls and one consented opaque native dispatch', 'catalog-dispatch'],
  ['independent unauthenticated context is denied without touching the shared session', 'unauthenticated-denial'],
  ['separately attested expired disposable fixture is rejected by HA auth without accepted calls', 'attested-expiry'],
]);
const STATUSES = new Set(['passed', 'failed', 'timedOut', 'skipped', 'interrupted']);
const known = (status) => STATUSES.has(status) ? status : 'unknown';

export default class SafeReporter {
  onTestEnd(test, result) {
    process.stdout.write(`HA catalog scenario ${SCENARIO_IDS.get(test.title) ?? 'unlisted'}: ${known(result.status)}\n`);
  }
  onError() {
    process.stderr.write('HA catalog blocked: host prerequisite or scenario failed; sensitive diagnostics suppressed.\n');
  }
  onStdOut() {}
  onStdErr() {}
  onEnd(result) {
    process.stdout.write(`HA catalog acceptance: ${known(result.status)}; actual expiry/provider layout/physical audio require recorded host evidence and human review.\n`);
  }
}