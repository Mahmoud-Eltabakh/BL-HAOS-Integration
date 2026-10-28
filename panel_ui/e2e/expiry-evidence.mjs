export const HA_LOGIN_PATH = '/auth/authorize';

// Verdict is `expired` only for an attested fixture with real HA auth rejection and no accepted call.
export function classifyExpiryEvidence(observation) {
  const responses = observation.responses ?? {};
  const code = observation.probe && typeof observation.probe === 'object' ? observation.probe.code : undefined;
  if (observation.probe === 'accepted' || responses.accepted > 0) return 'accepted';
  if (observation.hass?.connected === true) {
    return code === 'unauthorized' || responses.unauthorized > 0 || responses.forbidden > 0 || responses.tokenRejected > 0
      ? 'denied' : 'accepted';
  }
  const authRejected = observation.pathname === HA_LOGIN_PATH || responses.tokenRejected > 0 || responses.unauthorized > 0;
  if (authRejected) return observation.attested === true ? 'expired' : 'denied';
  if (responses.forbidden > 0 || code === 'unauthorized') return 'denied';
  if (typeof code === 'number' || observation.hass?.connected === false) return 'disconnected';
  return 'pending';
}
