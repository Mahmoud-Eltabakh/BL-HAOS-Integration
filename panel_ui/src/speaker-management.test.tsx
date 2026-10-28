import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { SpeakerManagement } from './speaker-management';

describe('SpeakerManagement', () => {
  it('uses admin commands for scan, pair, connect, speaker/system settings, removal and adapter power', async () => {
    let paired = false;
    let connected = false;
    let removed = false;
    const hass = {
      callWS: vi.fn(async (message: any) => {
        switch (message.type) {
          case 'bl_haos/speakers/devices':
            return removed ? [] : [
              { address: 'aa:bb:cc:dd:ee:01', name: 'Discovered', paired, connected, is_audio_sink: true },
              { address: 'aa:bb:cc:dd:ee:02', name: 'Office', paired: true, trusted: true, connected: false, is_audio_sink: true },
            ];
          case 'bl_haos/speakers/settings/get':
            return {
              speakers: { 'aa:bb:cc:dd:ee:02': { custom_alias: 'Office', auto_reconnect: true, preferred_adapter: 'hci0', default_volume: 60 } },
              log_level: 'info', default_codec: 'auto', auto_reconnect_enabled: true,
            };
          case 'bl_haos/speakers/adapters/list':
            return [{ interface: 'hci0', powered: true }];
          case 'bl_haos/speakers/pair': paired = true; return { paired: true };
          case 'bl_haos/speakers/connect': connected = true; return { connected: true };
          case 'bl_haos/speakers/remove': removed = true; return { removed: true };
          default: return {};
        }
      }),
    };
    render(<SpeakerManagement hass={hass} />);
    await screen.findByText('Discovered');

    fireEvent.click(screen.getByRole('button', { name: 'Scan' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/scan', start: true }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Pairing PIN' }), { target: { value: '1738' } });
    fireEvent.click(screen.getByRole('button', { name: 'Pair' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/pair', address: 'aa:bb:cc:dd:ee:01', pin: '1738' }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Connect' })).toHaveLength(2));
    fireEvent.click(screen.getAllByRole('button', { name: 'Connect' })[0]);
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/connect', address: 'aa:bb:cc:dd:ee:01' }));

    fireEvent.change(screen.getByRole('textbox', { name: 'Rename Discovered' }), { target: { value: 'Studio' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Save name' })[0]);
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/settings/update', address: 'aa:bb:cc:dd:ee:01', custom_alias: 'Studio' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Save speaker settings' })[0]);
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith(expect.objectContaining({ type: 'bl_haos/speakers/settings/update', address: 'aa:bb:cc:dd:ee:01', default_volume: 50 })));

    fireEvent.change(screen.getByRole('combobox', { name: 'Log level' }), { target: { value: 'debug' } });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/system-settings/update', log_level: 'debug' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Default codec' }), { target: { value: 'ldac' } });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/system-settings/update', default_codec: 'ldac' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Global auto-reconnect' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/system-settings/update', auto_reconnect_enabled: false }));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Adapter power hci0' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/adapters/power', adapter_name: 'hci0', powered: false }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm remove' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({ type: 'bl_haos/speakers/remove', address: 'aa:bb:cc:dd:ee:01' }));
  });

  it('shows a fixed safe error when an HA command fails', async () => {
    const hass = { callWS: vi.fn(async (message: any) => {
      if (message.type === 'bl_haos/speakers/devices') throw new Error('/org/bluez/hci0/dev_secret: raw DBus detail');
      return [];
    }) };
    render(<SpeakerManagement hass={hass} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Bluetooth action failed');
    expect(screen.queryByText(/org\/bluez|raw DBus/)).not.toBeInTheDocument();
  });
});


