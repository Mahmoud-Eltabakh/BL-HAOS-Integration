import { useCallback, useEffect, useState } from 'react';

export interface SpeakerRecord {
  address: string;
  name?: string | null;
  paired?: boolean;
  trusted?: boolean;
  connected?: boolean;
  is_audio_sink?: boolean;
  adapter?: string;
}

export interface SpeakerSettings {
  custom_alias?: string | null;
  auto_reconnect?: boolean;
  preferred_adapter?: string | null;
  default_volume?: number;
  codec_override?: string | null;
}

export interface ManagementHass {
  callWS(message: any): Promise<any>;
}

const codecs = ['auto', 'sbc', 'sbc_xq', 'aac', 'aptx', 'aptx_hd', 'ldac'];
const logLevels = ['trace', 'debug', 'info', 'notice', 'warning', 'error', 'fatal'];

export function SpeakerManagement({ hass }: { hass?: ManagementHass }) {
  const [devices, setDevices] = useState<SpeakerRecord[]>([]);
  const [adapters, setAdapters] = useState<Array<{ interface: string; powered: boolean }>>([]);
  const [settings, setSettings] = useState<{ speakers?: Record<string, SpeakerSettings>; log_level?: string; default_codec?: string; auto_reconnect_enabled?: boolean }>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [pin, setPin] = useState('0000');
  const [alias, setAlias] = useState<Record<string, string>>({});
  const [removeAddress, setRemoveAddress] = useState('');

  const refresh = useCallback(async () => {
    if (!hass) return;
    try {
      const [deviceResult, settingsResult, adapterResult] = await Promise.all([
        hass.callWS({ type: 'bl_haos/speakers/devices' }),
        hass.callWS({ type: 'bl_haos/speakers/settings/get' }),
        hass.callWS({ type: 'bl_haos/speakers/adapters/list' }),
      ]);
      setDevices(Array.isArray(deviceResult) ? deviceResult as SpeakerRecord[] : []);
      setSettings(settingsResult && typeof settingsResult === 'object' ? settingsResult : {});
      setAdapters(Array.isArray(adapterResult) ? adapterResult as Array<{ interface: string; powered: boolean }> : []);
    } catch {
      setError('Bluetooth action failed');
    }
  }, [hass]);

  useEffect(() => { void refresh(); }, [refresh]);

  const run = async (label: string, operation: () => Promise<unknown>) => {
    if (!hass) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await operation();
      setStatus(label);
      await refresh();
    } catch {
      setError('Bluetooth action failed');
    } finally {
      setBusy(false);
    }
  };

  const updateSpeaker = (address: string, fields: Record<string, unknown>) =>
    run('Speaker settings saved.', () => hass!.callWS({ type: 'bl_haos/speakers/settings/update', address, ...fields }));

  const updateSystem = (fields: Record<string, unknown>) =>
    run('System settings saved.', () => hass!.callWS({ type: 'bl_haos/speakers/system-settings/update', ...fields }));

  if (!hass) return <section className="neu-surface"><p role="alert">Home Assistant is unavailable.</p></section>;
  return <section className="speaker-management" aria-label="Speaker management" aria-busy={busy}>
    <header><h2>Speakers</h2><button className="neu-button" type="button" disabled={busy}
      onClick={() => void run('Scan started.', () => hass.callWS({ type: 'bl_haos/speakers/scan', start: true }))}>Scan</button>
      <button className="neu-button" type="button" disabled={busy}
        onClick={() => void run('Scan stopped.', () => hass.callWS({ type: 'bl_haos/speakers/scan', start: false }))}>Stop scan</button></header>
    {error && <p className="error" role="alert">{error}</p>}
    <p role="status" aria-live="polite">{status}</p>
    <label>Pairing PIN <input aria-label="Pairing PIN" value={pin} onChange={(event) => setPin(event.target.value)} /></label>
    <ul aria-label="Bluetooth devices">{devices.map((device) => {
      const saved = settings.speakers?.[device.address] ?? {};
      return <li key={device.address} className="neu-surface">
        <h3>{device.name || device.address}</h3><p>{device.address} · {device.connected ? 'Connected' : device.paired ? 'Paired' : 'Discovered'}</p>
        {!device.paired && <button className="neu-button" type="button" disabled={busy}
          onClick={() => void run('Pairing requested.', () => hass.callWS({ type: 'bl_haos/speakers/pair', address: device.address, pin }))}>Pair</button>}
        {device.paired && (device.connected
          ? <button className="neu-button" type="button" disabled={busy} onClick={() => void run('Speaker disconnected.', () => hass.callWS({ type: 'bl_haos/speakers/disconnect', address: device.address }))}>Disconnect</button>
          : <button className="neu-button" type="button" disabled={busy} onClick={() => void run('Speaker connected.', () => hass.callWS({ type: 'bl_haos/speakers/connect', address: device.address }))}>Connect</button>)}
        {device.paired && <>
          <label>Rename <input aria-label={`Rename ${device.name || device.address}`} value={alias[device.address] ?? saved.custom_alias ?? ''}
            onChange={(event) => setAlias((current) => ({ ...current, [device.address]: event.target.value }))} /></label>
          <button className="neu-button" type="button" disabled={busy}
            onClick={() => void updateSpeaker(device.address, { custom_alias: alias[device.address] ?? saved.custom_alias ?? '' })}>Save name</button>
          <label><input type="checkbox" aria-label={`Auto-reconnect ${device.name || device.address}`}
            checked={saved.auto_reconnect ?? true} onChange={(event) => void updateSpeaker(device.address, { auto_reconnect: event.target.checked })} /> Auto-reconnect</label>
          <label>Preferred adapter <input aria-label={`Preferred adapter ${device.name || device.address}`} value={saved.preferred_adapter ?? ''}
            onChange={(event) => setSettings((current) => ({ ...current, speakers: { ...current.speakers, [device.address]: { ...saved, preferred_adapter: event.target.value } } }))} /></label>
          <label>Default volume <input type="number" min="0" max="100" aria-label={`Default volume ${device.name || device.address}`}
            value={saved.default_volume ?? 50} onChange={(event) => setSettings((current) => ({ ...current, speakers: { ...current.speakers, [device.address]: { ...saved, default_volume: Number(event.target.value) } } }))} /></label>
          <label>Codec override <select aria-label={`Codec override ${device.name || device.address}`} value={saved.codec_override ?? ''}
            onChange={(event) => void updateSpeaker(device.address, { codec_override: event.target.value || null })}>
            <option value="">Default</option>{codecs.map((codec) => <option key={codec} value={codec}>{codec}</option>)}
          </select></label>
          <button className="neu-button" type="button" disabled={busy} onClick={() => void updateSpeaker(device.address, {
            custom_alias: alias[device.address] ?? saved.custom_alias ?? '',
            auto_reconnect: saved.auto_reconnect ?? true,
            preferred_adapter: saved.preferred_adapter ?? null,
            default_volume: saved.default_volume ?? 50,
            codec_override: saved.codec_override ?? null,
          })}>Save speaker settings</button>
          <button className="neu-button" type="button" disabled={busy} onClick={() => setRemoveAddress(device.address)}>Remove</button>
        </>}
      </li>;
    })}</ul>
    <section className="neu-surface" aria-label="Bluetooth adapters"><h3>Adapters</h3>
      {adapters.map((adapter) => <label key={adapter.interface}>
        <input type="checkbox" aria-label={`Adapter power ${adapter.interface}`} checked={adapter.powered} disabled={busy}
          onChange={(event) => void run('Adapter updated.', () => hass.callWS({ type: 'bl_haos/speakers/adapters/power', adapter_name: adapter.interface, powered: event.target.checked }))} />
        {adapter.interface} powered
      </label>)}
    </section>
    <section className="neu-surface" aria-label="System settings"><h3>System settings</h3>
      <label>Log level <select aria-label="Log level" value={settings.log_level ?? 'info'} disabled={busy}
        onChange={(event) => void updateSystem({ log_level: event.target.value })}>{logLevels.map((level) => <option key={level}>{level}</option>)}</select></label>
      <label>Default codec <select aria-label="Default codec" value={settings.default_codec ?? 'auto'} disabled={busy}
        onChange={(event) => void updateSystem({ default_codec: event.target.value })}>{codecs.map((codec) => <option key={codec}>{codec}</option>)}</select></label>
      <label><input type="checkbox" aria-label="Global auto-reconnect" checked={settings.auto_reconnect_enabled ?? true} disabled={busy}
        onChange={(event) => void updateSystem({ auto_reconnect_enabled: event.target.checked })} /> Global auto-reconnect</label>
    </section>
    {removeAddress && <dialog open aria-modal="true" aria-label="Confirm speaker removal">
      <p>Remove this speaker?</p>
      <button className="neu-button" type="button" onClick={() => setRemoveAddress('')}>Cancel</button>
      <button className="neu-button" type="button" disabled={busy} onClick={() => {
        const address = removeAddress;
        setRemoveAddress('');
        void run('Speaker removed.', () => hass.callWS({ type: 'bl_haos/speakers/remove', address }));
      }}>Confirm remove</button>
    </dialog>}
  </section>;
}
