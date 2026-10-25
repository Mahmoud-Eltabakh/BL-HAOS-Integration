import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { MediaPanel, type BrowseMedia, type Hass } from './media-panel';

describe('saved playlist library tracer', () => {
  it('opens Library first and creates an empty custom playlist through HA', async () => {
    const recordId = 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012';
    const hass: Hass = {
      connection: { connected: true },
      user: { id: 'local-user' },
      states: {},
      callWS: vi.fn<Hass['callWS']>(async () => ({ revision: 0, records: [] } as unknown as BrowseMedia)),
      callService: vi.fn(async () => undefined),
    };
    vi.mocked(hass.callWS)
      .mockResolvedValueOnce({ revision: 0, records: [] } as unknown as BrowseMedia)
      .mockResolvedValueOnce({
        revision: 1,
        records: [{ record_id: recordId, kind: 'custom', name: 'Quiet hours', entries: [] }],
      } as unknown as BrowseMedia);

    render(<MediaPanel hass={hass} />);
    expect(screen.queryByRole('heading', { name: 'Your playlists' })).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Quiet hours' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save playlist' }));

    await waitFor(() => expect(hass.callWS).toHaveBeenCalledWith(expect.objectContaining({
      type: 'bl_haos/playlist_library/save_custom',
      record_id: recordId,
      name: 'Quiet hours',
      entries: [],
      revision: 0,
    })));
    expect(await screen.findByText('Quiet hours')).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });
});