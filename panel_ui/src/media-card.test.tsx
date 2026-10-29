import { act, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MediaCardElement, type Hass } from './media-panel';

function cardHass(label = 'Kitchen'): Hass {
  return {
    connection: { connected: true },
    user: { id: 'local-user' },
    states: {
      'media_player.kitchen': {
        entity_id: 'media_player.kitchen',
        state: 'idle',
        attributes: {
          friendly_name: label,
          bluetooth_address: 'aa:bb:cc:dd:ee:01',
          adapter: 'hci0',
        },
      },
    },
    callWS: vi.fn(async (message) => {
      if (message.type === 'bl_haos/playlist_library/list') return { revision: 0, records: [] };
      if (message.type === 'bl_haos/speakers/devices') return [
        { address: 'aa:bb:cc:dd:ee:01', name: 'Kitchen', paired: true, connected: true },
        { address: 'aa:bb:cc:dd:ee:02', name: 'New Speaker', paired: false, connected: false },
      ] as never;
      if (message.type === 'bl_haos/speakers/settings/get') return {
        speakers: { 'aa:bb:cc:dd:ee:01': { custom_alias: 'Kitchen', default_volume: 40 } },
        default_codec: 'auto',
        auto_reconnect_enabled: true,
      } as never;
      if (message.type === 'bl_haos/speakers/adapters/list') return [{ interface: 'hci0', powered: true }] as never;
      return {
        title: 'Media sources',
        media_content_id: 'media-source://',
        media_content_type: 'app',
        can_play: false,
        can_expand: true,
        children: [],
      };
    }),
    callService: vi.fn(async () => undefined),
    fetchWithAuth: vi.fn(async () => new Response('artwork', { headers: { 'Content-Type': 'image/png' } })),
  };
}

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

describe('Lovelace media card contract', () => {
  it('advertises stable dimensions and one picker descriptor', () => {
    expect(MediaCardElement.prototype.getCardSize.call(document.createElement('bl-haos-media-card'))).toBe(8);
    expect(MediaCardElement.prototype.getGridOptions.call(document.createElement('bl-haos-media-card'))).toEqual({
      columns: 12,
      min_columns: 6,
      rows: 'auto',
    });
    expect(MediaCardElement.getStubConfig()).toEqual({});
    expect(window.customCards?.filter(({ type }) => type === 'bl-haos-media-card')).toHaveLength(1);
    expect(window.customCards?.find(({ type }) => type === 'bl-haos-media-card')).toMatchObject({
      name: 'BL-HAOS Media',
      preview: false,
      documentationURL: expect.stringContaining('/modules/integration/README.md'),
    });
  });

  it.each([
    [null, 'must be an object'],
    [[], 'must be an object'],
    [{ type: 'custom:wrong-card' }, 'card type must be'],
    [{ type: 'custom:bl-haos-media-card', initial_view: 'settings' }, 'initial_view must be'],
  ])('rejects invalid config %j', (config, message) => {
    const card = document.createElement('bl-haos-media-card') as MediaCardElement;
    expect(() => card.setConfig(config)).toThrow(message);
  });

  it('forwards hass to the shared application and survives Lovelace reconnects', async () => {
    const card = document.createElement('bl-haos-media-card') as MediaCardElement;
    const firstHass = cardHass();
    card.setConfig({ type: 'custom:bl-haos-media-card', initial_view: 'browse' });
    await act(async () => {
      document.body.append(card);
      card.hass = firstHass;
    });
    await waitFor(() => expect(card.shadowRoot?.querySelector('main')?.textContent).toContain('Media sources'));
    await waitFor(() => expect(firstHass.callWS).toHaveBeenCalledWith({
      type: 'media_source/browse_media',
    }));
    expect(card.shadowRoot?.querySelector('[aria-label="Close catalog"]')).toBeNull();

    const styles = card.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(styles).toContain(':host { display:block; width:100%; min-width:0; height:auto; container-type:inline-size;');
    expect(styles).toContain('.neu-page { width:100%; min-width:0; max-width:none; min-height:0;');
    expect(styles).toContain('@container (max-width:640px)');
    expect(styles).not.toContain('height:100dvh');
    expect(styles).not.toContain('max-width:480px');
    expect(styles).toContain('.neu-page.card-layout .confirmation-dialog { max-height:min(90vh,640px); }');
    expect(card.shadowRoot?.querySelector('iframe')).toBeNull();

    await act(async () => { card.remove(); });
    const secondHass = cardHass('Office');
    await act(async () => {
      document.body.append(card);
      card.hass = secondHass;
    });
    await waitFor(() => expect(card.shadowRoot?.querySelector('main')?.textContent).toContain('Media sources'));
    expect(card.hass).toBe(secondHass);
    await act(async () => { card.remove(); });
  });

  it('routes pairing, disconnect, rename, and system settings through injected hass', async () => {
    const card = document.createElement('bl-haos-media-card') as MediaCardElement;
    const hass = cardHass();
    card.setConfig({ type: 'custom:bl-haos-media-card' });
    await act(async () => {
      document.body.append(card);
      card.hass = hass;
    });
    const speakersTab = Array.from(card.shadowRoot?.querySelectorAll('button') ?? [])
      .find((button) => button.textContent?.trim() === 'Speakers');
    expect(speakersTab).toBeDefined();
    await act(async () => { speakersTab?.click(); });
    await waitFor(() => expect(card.shadowRoot?.querySelector('[aria-label="Speaker management"]')).not.toBeNull());

    const buttonNamed = (name: string) => Array.from(card.shadowRoot?.querySelectorAll('button') ?? [])
      .find((button) => button.textContent?.trim() === name);
    await act(async () => { buttonNamed('Pair')?.click(); });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({
      type: 'bl_haos/speakers/pair', address: 'aa:bb:cc:dd:ee:02', pin: '0000',
    }));

    await act(async () => { buttonNamed('Disconnect')?.click(); });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({
      type: 'bl_haos/speakers/disconnect', address: 'aa:bb:cc:dd:ee:01',
    }));

    const rename = card.shadowRoot?.querySelector<HTMLInputElement>('input[aria-label="Rename Kitchen"]');
    expect(rename).not.toBeNull();
    fireEvent.change(rename!, { target: { value: 'Studio speaker' } });
    await act(async () => { buttonNamed('Save name')?.click(); });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({
      type: 'bl_haos/speakers/settings/update', address: 'aa:bb:cc:dd:ee:01', custom_alias: 'Studio speaker',
    }));

    const defaultCodec = card.shadowRoot?.querySelector<HTMLSelectElement>('select[aria-label="Default codec"]');
    expect(defaultCodec).not.toBeNull();
    fireEvent.change(defaultCodec!, { target: { value: 'sbc' } });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith({
      type: 'bl_haos/speakers/system-settings/update', default_codec: 'sbc',
    }));
    await act(async () => { card.remove(); });
  });
});
