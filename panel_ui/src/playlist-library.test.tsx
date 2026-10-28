import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MediaPanel, type BrowseMedia, type Hass } from './media-panel';

afterEach(() => vi.unstubAllGlobals());

describe('saved playlist library tracer', () => {
  it('opens Library first and creates an empty custom playlist through HA', async () => {
    const recordId = 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012';
    vi.stubGlobal('crypto', { randomUUID: () => recordId });
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
    const createButton = screen.getByRole('button', { name: 'Create playlist' });
    await waitFor(() => expect(createButton).toBeEnabled());
    fireEvent.click(createButton);
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

  it('browses an exact HA reference, saves it, and starts that playlist on the selected speaker', async () => {
    const recordId = 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012';
    const mediaContentId = 'media-source://provider/track%2Fopaque?slot=a%2Bb';
    const entry = {
      media_content_id: mediaContentId,
      title: 'Browseable audio',
      media_class: 'music',
      media_content_type: 'audio/mpeg',
    };
    const savedRecord = {
      record_id: recordId, record_revision: 1, kind: 'custom' as const,
      name: 'Road mix', entries: [entry],
    };
    const root: BrowseMedia = {
      title: 'Media sources', media_content_id: 'media-source://', media_content_type: 'app',
      can_play: false, can_expand: true,
      children: [{ ...entry, can_play: true, can_expand: false }],
    };
    vi.stubGlobal('crypto', { randomUUID: () => recordId });
    const hass: Hass = {
      connection: { connected: true },
      user: { id: 'local-user' },
      states: {
        'media_player.kitchen': { entity_id: 'media_player.kitchen', state: 'idle', attributes: {
          friendly_name: 'Kitchen', bluetooth_address: 'aa:bb:cc:dd:ee:01', adapter: 'hci0',
        } },
      },
      callWS: vi.fn<Hass['callWS']>(async (message) => {
        if (message.type === 'bl_haos/playlist_library/list') return { revision: 0, records: [] };
        if (message.type === 'media_source/browse_media') return root;
        if (message.type === 'bl_haos/playlist_library/save_custom') {
          return { revision: 1, records: [savedRecord] } as unknown as BrowseMedia;
        }
        if (message.type === 'bl_haos/playlist_library/start') {
          return { revision: 1, records: [savedRecord] } as unknown as BrowseMedia;
        }
        throw new Error(`Unexpected command: ${message.type}`);
      }),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create playlist' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Road mix' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add media' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Add media Browseable audio' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save playlist' }));
    await screen.findByText('Road mix');
    fireEvent.change(screen.getByRole('combobox', { name: 'Play on' }), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play playlist Road mix' }));

    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/start', record_id: recordId, entity_id: 'media_player.kitchen',
    }));
    const calls = vi.mocked(hass.callWS).mock.calls.map(([message]) => message);
    expect(calls.map((message) => message.type)).toEqual([
      'bl_haos/playlist_library/list',
      'media_source/browse_media',
      'bl_haos/playlist_library/save_custom',
      'bl_haos/playlist_library/start',
    ]);
    expect(calls[1]).toEqual({ type: 'media_source/browse_media' });
    expect(calls[2]).toEqual({
      type: 'bl_haos/playlist_library/save_custom',
      record_id: recordId,
      name: 'Road mix',
      entries: [entry],
      revision: 0,
    });
    expect(calls[3]).toEqual({
      type: 'bl_haos/playlist_library/start', record_id: recordId, entity_id: 'media_player.kitchen',
    });
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('keeps a failed library load out of the empty state and disables mutations', async () => {
    const hass: Hass = {
      connection: { connected: true },
      user: { id: 'local-user' },
      states: {},
      callWS: vi.fn<Hass['callWS']>().mockRejectedValue(new Error('storage unavailable')),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn\'t load your library.');
    expect(screen.queryByRole('heading', { name: 'Your library is empty' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create playlist' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Retry loading' })).toBeEnabled();
  });

  it('reuses the client-allocated ID when a create request is retried', async () => {
    const recordId = 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012';
    vi.stubGlobal('crypto', { randomUUID: () => recordId });
    const hass: Hass = {
      connection: { connected: true },
      user: { id: 'local-user' },
      states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce({ revision: 0, records: [] } as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error('temporary failure'))
        .mockResolvedValueOnce({
          revision: 1,
          records: [{ record_id: recordId, kind: 'custom', name: 'Quiet hours', entries: [] }],
        } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create playlist' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Quiet hours' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save playlist' }));
    expect(await screen.findByText(/Couldn't save this playlist right now/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Save playlist' }));

    await screen.findByText('Quiet hours');
    const creates = vi.mocked(hass.callWS).mock.calls
      .map(([message]) => message)
      .filter((message) => message.type === 'bl_haos/playlist_library/save_custom');
    expect(creates).toHaveLength(2);
    expect(creates.map((message) => 'record_id' in message ? message.record_id : undefined)).toEqual([recordId, recordId]);
    expect(hass.callService).not.toHaveBeenCalled();
  });
});

describe('custom playlist editor', () => {
  const firstEntry = {
    media_content_id: 'media-source://provider/first%2Fopaque?slot=1',
    title: 'First track',
    media_class: 'music',
    media_content_type: 'audio/mpeg',
  };
  const secondEntry = {
    media_content_id: 'media-source://provider/second%2Fopaque?slot=2',
    title: 'Second track',
    media_class: 'music',
    media_content_type: 'audio/mpeg',
  };
  const recordId = 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012';

  it('edits and keyboard-reorders exact opaque references without losing duplicates', async () => {
    const saved = {
      revision: 3,
      records: [{ record_id: recordId, record_revision: 2, kind: 'custom', name: 'Road mix', entries: [
        firstEntry, secondEntry, firstEntry,
      ] }],
    };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce(saved as unknown as BrowseMedia)
        .mockResolvedValueOnce({ revision: 4, records: [{ ...saved.records[0], name: 'Night drive', entries: [secondEntry, firstEntry, firstEntry] }] } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Road mix');
    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Road mix');

    const moveDown = screen.getAllByRole('button', { name: 'Move entry down' });
    fireEvent.click(moveDown[0]);
    expect(screen.getByRole('status')).toHaveTextContent('Moved First track to position 2 of 3.');
    const orderedEntries = screen.getByRole('list', { name: 'Playlist entries' });
    const entryRows = within(orderedEntries).getAllByRole('listitem');
    expect(within(entryRows[1]).getByRole('button', { name: 'Move entry down' })).toHaveFocus();
    expect(within(entryRows[0]).getByRole('button', { name: 'Move entry up' })).toBeDisabled();
    expect(within(entryRows[2]).getByRole('button', { name: 'Move entry down' })).toBeDisabled();

    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Night drive' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/update_custom',
      record_id: recordId,
      name: 'Night drive',
      entries: [secondEntry, firstEntry, firstEntry],
      revision: 3,
    }));
    expect(await screen.findByText('Night drive')).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('adds only playable browse results, allows duplicate references, and saves an empty draft', async () => {
    const record = { record_id: recordId, record_revision: 1, kind: 'custom', name: 'New mix', entries: [] };
    const root: BrowseMedia = {
      title: 'Media sources', media_content_id: 'media-source://', media_content_type: 'app',
      can_play: false, can_expand: true,
      children: [
        { ...firstEntry, can_play: true, can_expand: false },
        { title: 'Folder', media_content_id: 'media-source://provider/folder', media_content_type: 'app', can_play: false, can_expand: true },
        { title: 'Unavailable item', media_content_id: 'media-source://provider/unavailable', media_content_type: 'audio/mpeg', can_play: false, can_expand: false },
      ],
    };
    vi.stubGlobal('crypto', { randomUUID: () => recordId });
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce({ revision: 0, records: [] } as unknown as BrowseMedia)
        .mockResolvedValueOnce(root)
        .mockResolvedValueOnce({ revision: 1, records: [record] } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create playlist' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'New mix' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add media' }));

    const addTrack = await screen.findByRole('button', { name: 'Add media First track' });
    expect(screen.queryByRole('button', { name: 'Add media Unavailable item' })).not.toBeInTheDocument();
    fireEvent.click(addTrack);
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('New mix');
    expect(screen.getAllByText('First track')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Add media' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Add media First track' }));
    expect(screen.getAllByText('First track')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Save playlist' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/save_custom',
      record_id: recordId,
      name: 'New mix',
      entries: [firstEntry, firstEntry],
      revision: 0,
    }));
    expect(await screen.findByText('New mix')).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('retains the dirty draft and newer saved row after a stale-revision conflict', async () => {
    const initiallyLoaded = {
      revision: 2,
      records: [{ record_id: recordId, record_revision: 2, kind: 'custom', name: 'Earlier version', entries: [firstEntry] }],
    };
    const latestServer = {
      revision: 4,
      records: [{ record_id: recordId, record_revision: 4, kind: 'custom', name: 'Server version', entries: [secondEntry] }],
    };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce(initiallyLoaded as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error('Playlist library changed; reload and retry'))
        .mockResolvedValueOnce(latestServer as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Earlier version');
    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'My unsaved edit' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('This playlist changed in Home Assistant. Your edits are still here.');
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('My unsaved edit');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledTimes(3));
    expect(hass.callWS).toHaveBeenLastCalledWith({ type: 'bl_haos/playlist_library/list' });
    fireEvent.click(screen.getByRole('button', { name: 'Stop editing' }));
    expect(await screen.findByText('Server version')).toBeVisible();
    expect(screen.queryByText('My unsaved edit')).not.toBeInTheDocument();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('keeps the editor pending until Home Assistant acknowledges the save', async () => {
    const saved = {
      revision: 1,
      records: [{ record_id: recordId, record_revision: 1, kind: 'custom', name: 'Road mix', entries: [firstEntry] }],
    };
    let resolveSave!: (value: BrowseMedia) => void;
    const saveResult = new Promise<BrowseMedia>((resolve) => { resolveSave = resolve; });
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(saved as unknown as BrowseMedia).mockReturnValueOnce(saveResult),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Road mix');
    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'New road mix' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('New road mix');
    expect(screen.getByRole('list', { name: 'Playlist entries' })).toHaveTextContent('First track');
    expect(screen.getByRole('status')).toHaveTextContent('Saving changes...');
    await act(async () => resolveSave({ revision: 2, records: [{ ...saved.records[0], record_revision: 2, name: 'New road mix' }] } as unknown as BrowseMedia));
    expect(await screen.findByText('New road mix')).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('ignores a prior-session save response without closing a new session draft', async () => {
    const oldSnapshot = {
      revision: 1,
      records: [{ record_id: recordId, record_revision: 1, kind: 'custom', name: 'Old session mix', entries: [] }],
    };
    let resolveOldSave!: (value: BrowseMedia) => void;
    const oldSave = new Promise<BrowseMedia>((resolve) => { resolveOldSave = resolve; });
    const oldHass: Hass = {
      connection: { connected: true }, user: { id: 'old-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(oldSnapshot as unknown as BrowseMedia).mockReturnValueOnce(oldSave),
      callService: vi.fn(async () => undefined),
    };
    const view = render(<MediaPanel hass={oldHass} />);
    await screen.findByText('Old session mix');
    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Old pending edit' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    const currentSnapshot = {
      revision: 8,
      records: [{ record_id: 'a4d5e6f7-1234-4a11-8b3f-6d7e8f9012ab', record_revision: 8, kind: 'custom', name: 'Current session mix', entries: [] }],
    };
    const currentHass: Hass = {
      connection: { connected: true }, user: { id: 'current-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>(async () => currentSnapshot as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };
    view.rerender(<MediaPanel hass={currentHass} />);
    await screen.findByText('Current session mix');
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Fresh session draft' } });

    await act(async () => resolveOldSave({ revision: 2, records: [{ ...oldSnapshot.records[0], name: 'Old pending edit' }] } as unknown as BrowseMedia));

    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Fresh session draft');
    expect(screen.getByText('Current session mix')).toBeVisible();
    expect(screen.queryByText('Old pending edit')).not.toBeInTheDocument();
  });

  it('does not apply a prior-session delete response to the replacement library', async () => {
    const oldSnapshot = {
      revision: 1,
      records: [{ record_id: recordId, record_revision: 1, kind: 'custom', name: 'Old session mix', entries: [] }],
    };
    let resolveOldDelete!: (value: BrowseMedia) => void;
    const oldDelete = new Promise<BrowseMedia>((resolve) => { resolveOldDelete = resolve; });
    const oldHass: Hass = {
      connection: { connected: true }, user: { id: 'old-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(oldSnapshot as unknown as BrowseMedia).mockReturnValueOnce(oldDelete),
      callService: vi.fn(async () => undefined),
    };
    const view = render(<MediaPanel hass={oldHass} />);
    await screen.findByText('Old session mix');
    fireEvent.click(screen.getByRole('button', { name: 'Delete playlist' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete playlist' }));

    const currentSnapshot = {
      revision: 8,
      records: [{ record_id: 'a4d5e6f7-1234-4a11-8b3f-6d7e8f9012ab', record_revision: 8, kind: 'custom', name: 'Current session mix', entries: [] }],
    };
    const currentHass: Hass = {
      connection: { connected: true }, user: { id: 'current-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>(async () => currentSnapshot as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };
    view.rerender(<MediaPanel hass={currentHass} />);
    await screen.findByText('Current session mix');

    await act(async () => resolveOldDelete({ revision: 2, records: [] } as unknown as BrowseMedia));

    expect(screen.getByText('Current session mix')).toBeVisible();
    expect(screen.queryByText('Old session mix')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not clear replacement-session save status when an old conflict refresh finishes', async () => {
    const oldSnapshot = {
      revision: 1,
      records: [{ record_id: recordId, record_revision: 1, kind: 'custom', name: 'Old session mix', entries: [] }],
    };
    let resolveOldRefresh!: (value: BrowseMedia) => void;
    const oldRefresh = new Promise<BrowseMedia>((resolve) => { resolveOldRefresh = resolve; });
    const oldHass: Hass = {
      connection: { connected: true }, user: { id: 'old-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce(oldSnapshot as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error('Playlist library changed; reload and retry'))
        .mockReturnValueOnce(oldRefresh),
      callService: vi.fn(async () => undefined),
    };
    const view = render(<MediaPanel hass={oldHass} />);
    await screen.findByText('Old session mix');
    fireEvent.click(screen.getByRole('button', { name: 'Delete playlist' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete playlist' }));
    await waitFor(() => expect(oldHass.callWS).toHaveBeenCalledTimes(3));

    const currentSnapshot = { revision: 8, records: [] };
    let resolveCurrentSave!: (value: BrowseMedia) => void;
    const currentSave = new Promise<BrowseMedia>((resolve) => { resolveCurrentSave = resolve; });
    const currentHass: Hass = {
      connection: { connected: true }, user: { id: 'current-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(currentSnapshot as unknown as BrowseMedia).mockReturnValueOnce(currentSave),
      callService: vi.fn(async () => undefined),
    };
    view.rerender(<MediaPanel hass={currentHass} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create playlist' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Fresh session draft' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save playlist' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saving playlist...');

    await act(async () => resolveOldRefresh(oldSnapshot as unknown as BrowseMedia));
    expect(screen.getByRole('status')).toHaveTextContent('Saving playlist...');
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Fresh session draft');

    await act(async () => resolveCurrentSave({ revision: 9, records: [{ record_id: recordId, record_revision: 1, kind: 'custom', name: 'Fresh session draft', entries: [] }] } as unknown as BrowseMedia));
    expect(await screen.findByText('Fresh session draft')).toBeVisible();
  });

  it('allows the close link to navigate when the editor draft is clean', async () => {
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>(async () => ({ revision: 0, records: [] } as unknown as BrowseMedia)),
      callService: vi.fn(async () => undefined),
    };
    render(<MediaPanel hass={hass} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create playlist' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));

    const closeLink = screen.getByRole('link', { name: 'Close catalog' });
    const closeEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => { closeLink.dispatchEvent(closeEvent); });

    expect(closeEvent.defaultPrevented).toBe(false);
    expect(screen.queryByRole('textbox', { name: 'Playlist name' })).not.toBeInTheDocument();
  });

  it.each([
    ['Invalid playlist record', 'This playlist has details that can\'t be saved yet. Review the playlist name and entries, correct any marked fields, then select Save playlist or Save changes. Your valid draft data is still here.'],
    ['Unable to save playlist library', 'Couldn\'t save changes to “Road mix” right now. Your edits are still here.'],
  ])('preserves editable data and shows bounded recovery copy for %s', async (failure, recoveryCopy) => {
    const saved = {
      revision: 1,
      records: [{ record_id: recordId, record_revision: 1, kind: 'custom', name: 'Road mix', entries: [firstEntry] }],
    };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce(saved as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error(failure)),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Road mix');
    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Changed road mix' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(recoveryCopy);
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Changed road mix');
    expect(screen.getByRole('list', { name: 'Playlist entries' })).toHaveTextContent('First track');
    expect(screen.getByText('Road mix')).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });
});

describe('custom playlist confirmations', () => {
  const recordId = 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012';
  const otherRecordId = 'a4d5e6f7-1234-4a11-8b3f-5c6d7e8f9012';
  const entry = {
    media_content_id: 'media-source://provider/track%2Fopaque?slot=1',
    title: 'Saved track',
    media_class: 'music',
    media_content_type: 'audio/mpeg',
  };

  it('names the delete target, defaults focus to Keep playlist, and retains the row and dialog on failure', async () => {
    const snapshot = {
      revision: 2,
      records: [{ record_id: recordId, record_revision: 2, kind: 'custom', name: 'Road mix', entries: [entry] }],
    };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce(snapshot as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error('storage unavailable')),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Road mix');
    fireEvent.click(screen.getByRole('button', { name: 'Delete playlist' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete playlist: Road mix' });
    expect(dialog).toHaveTextContent('Delete “Road mix” from your BL-HAOS library? Its saved entries will be removed. This cannot be undone.');
    expect(within(dialog).getByRole('button', { name: 'Keep playlist' })).toHaveFocus();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete playlist' }));

    expect(await within(screen.getByRole('dialog')).findByRole('alert')).toHaveTextContent('Couldn\'t delete “Road mix” right now. It remains in your library.');
    expect(screen.getByRole('dialog', { name: 'Delete playlist: Road mix' })).toBeVisible();
    expect(screen.getByText('Road mix')).toBeVisible();
    expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/delete_custom', record_id: recordId, revision: 2,
    });
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('restores focus to a remaining playlist row after confirmed deletion', async () => {
    const first = { record_id: recordId, record_revision: 2, kind: 'custom', name: 'Road mix', entries: [entry] };
    const second = { record_id: otherRecordId, record_revision: 2, kind: 'custom', name: 'Quiet mix', entries: [] };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce({ revision: 2, records: [first, second] } as unknown as BrowseMedia)
        .mockResolvedValueOnce({ revision: 3, records: [second] } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Road mix');
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete playlist' })[0]);
    const dialog = screen.getByRole('dialog', { name: 'Delete playlist: Road mix' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete playlist' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByText('Road mix')).not.toBeInTheDocument();
    expect(screen.getByText('Quiet mix')).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Edit playlist' })[0]).toHaveFocus();
  });

  it('guards dirty editor exit, defaults to Keep editing, and treats Escape as Keep editing', async () => {
    const snapshot = {
      revision: 2,
      records: [{ record_id: recordId, record_revision: 2, kind: 'custom', name: 'Road mix', entries: [entry] }],
    };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(snapshot as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Road mix');
    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Unsaved name' } });
    fireEvent.click(screen.getByRole('button', { name: 'Stop editing' }));

    const dialog = screen.getByRole('dialog', { name: 'Discard changes' });
    expect(dialog).toHaveTextContent('Discard unsaved changes to “Road mix”? The saved playlist will remain unchanged.');
    expect(within(dialog).getByRole('button', { name: 'Keep editing' })).toHaveFocus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(within(dialog).getByRole('button', { name: 'Discard changes' })).toHaveFocus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(within(dialog).getByRole('button', { name: 'Keep editing' })).toHaveFocus();
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Unsaved name');
    expect(hass.callWS).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Stop editing' }));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Discard changes' })).getByRole('button', { name: 'Discard changes' }));
    expect(screen.queryByRole('textbox', { name: 'Playlist name' })).not.toBeInTheDocument();
    expect(screen.getByText('Road mix')).toBeVisible();
    expect(hass.callWS).toHaveBeenCalledTimes(1);
  });
});

describe('saved Home Assistant playlist shortcuts', () => {
  const mediaContentId = 'media-source://provider/playlist%2Fopaque?order=a%2Bb';
  const providerItem: BrowseMedia = {
    title: 'Evening playlist',
    media_content_id: mediaContentId,
    media_content_type: 'provider/playlist;opaque=Yes',
    media_class: 'playlist',
    can_play: true,
    can_expand: false,
  };
  const mediaRoot: BrowseMedia = {
    title: 'Media sources',
    media_content_id: 'media-source://',
    media_content_type: 'app',
    can_play: false,
    can_expand: true,
    children: [providerItem, {
      title: 'Single track',
      media_content_id: 'media-source://provider/track/1',
      media_content_type: 'audio/mpeg',
      media_class: 'music',
      can_play: true,
      can_expand: false,
    }],
  };
  const providerRecord = (name = 'Evening playlist') => ({
    record_id: 'c3f8941d-7e2b-4a11-8b3f-5c6d7e8f9012',
    record_revision: 1,
    kind: 'provider',
    name,
    media_content_id: mediaContentId,
    title: providerItem.title,
    media_class: providerItem.media_class,
    media_content_type: providerItem.media_content_type,
  });

  it('offers saving only for a browsed playlist and submits its exact reference once', async () => {
    const saved = { revision: 1, records: [providerRecord()] };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(mediaRoot as unknown as BrowseMedia)
        .mockResolvedValueOnce(saved as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} initialView="browse" />);
    const saveButton = await screen.findByRole('button', { name: 'Save to library Evening playlist' });
    expect(screen.queryByRole('button', { name: 'Save to library Single track' })).not.toBeInTheDocument();
    fireEvent.click(saveButton);
    expect(screen.getByRole('textbox', { name: 'Shortcut name' })).toHaveValue('Evening playlist');
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut' }));

    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/save_provider',
      media_content_id: mediaContentId,
      name: 'Evening playlist',
      title: 'Evening playlist',
      media_class: 'playlist',
      media_content_type: 'provider/playlist;opaque=Yes',
    }));
    expect(hass.callWS).toHaveBeenCalledTimes(2);
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('prevents duplicate saves while waiting for Home Assistant acknowledgment', async () => {
    let resolveSave!: (value: BrowseMedia) => void;
    const pendingSave = new Promise<BrowseMedia>((resolve) => { resolveSave = resolve; });
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(mediaRoot as unknown as BrowseMedia)
        .mockReturnValueOnce(pendingSave),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} initialView="browse" />);
    const saveButton = await screen.findByRole('button', { name: 'Save to library Evening playlist' });
    fireEvent.click(saveButton);
    const saveShortcut = screen.getByRole('button', { name: 'Save shortcut' });
    fireEvent.click(saveShortcut);
    expect(saveShortcut).toBeDisabled();
    fireEvent.click(saveShortcut);
    expect(vi.mocked(hass.callWS).mock.calls.filter(([message]) => message.type === 'bl_haos/playlist_library/save_provider')).toHaveLength(1);

    await act(async () => resolveSave({ revision: 1, records: [providerRecord()] } as unknown as BrowseMedia));
    expect(screen.getByRole('status')).toHaveTextContent('Playlist saved to your library.');
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('retries the same exact reference after failure and keeps the server canonical local name', async () => {
    const acceptedName = 'My hand-picked local name';
    const canonicalSnapshot = { revision: 1, records: [providerRecord(acceptedName)] };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(mediaRoot as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error('temporary provider failure'))
        .mockResolvedValueOnce(canonicalSnapshot as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} initialView="browse" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Save to library Evening playlist' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn\'t save “Evening playlist” to your library right now. Nothing was added.');
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/save_provider',
      media_content_id: mediaContentId,
      name: 'Evening playlist',
      title: 'Evening playlist',
      media_class: 'playlist',
      media_content_type: 'provider/playlist;opaque=Yes',
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    expect(await screen.findByText(acceptedName)).toBeVisible();
    expect(screen.getByText('Provider contents are managed by Home Assistant.')).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('renames only the local shortcut label using its stable record ID', async () => {
    const original = providerRecord();
    const renamed = { ...original, name: 'Renamed just for me', record_revision: 2 };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce({ revision: 1, records: [original] } as unknown as BrowseMedia)
        .mockRejectedValueOnce(new Error('invalid_format'))
        .mockResolvedValueOnce({ revision: 2, records: [renamed] } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Evening playlist');
    fireEvent.click(screen.getByRole('button', { name: 'Rename shortcut' }));
    const renameInput = screen.getByRole('textbox', { name: 'Shortcut name' });
    expect(renameInput).toHaveFocus();
    fireEvent.change(renameInput, { target: { value: 'é'.repeat(65) } });
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut name' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Shortcut names must be non-empty and at most 128 UTF-8 bytes.');
    expect(screen.getByRole('textbox', { name: 'Shortcut name' })).toHaveFocus();
    fireEvent.change(screen.getByRole('textbox', { name: 'Shortcut name' }), { target: { value: 'Renamed just for me' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut name' }));

    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/rename_provider',
      record_id: original.record_id,
      name: 'Renamed just for me',
      revision: 1,
    }));
    expect(await screen.findByText('Renamed just for me')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Rename shortcut' })).toHaveFocus();
    expect(screen.queryByRole('list', { name: 'Playlist entries' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit playlist' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Rename shortcut' }));
    expect(screen.getByRole('textbox', { name: 'Shortcut name' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel rename' }));
    expect(screen.getByRole('button', { name: 'Rename shortcut' })).toHaveFocus();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('confirms local-only removal, retains row and dialog on failure, and restores focus after retry', async () => {
    const original = providerRecord();
    let resolveRemoval!: (value: BrowseMedia) => void;
    const pendingRemoval = new Promise<BrowseMedia>((resolve) => { resolveRemoval = resolve; });
    const removed = { revision: 2, records: [] };
    let removeAttempts = 0;
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>(async (message) => {
        if (message.type === 'bl_haos/playlist_library/list') return { revision: 1, records: [original] } as unknown as BrowseMedia;
        if (message.type === 'bl_haos/playlist_library/delete_provider') {
          removeAttempts++;
          if (removeAttempts === 1) throw new Error('temporary failure');
          return pendingRemoval;
        }
        throw new Error(`Unexpected command: ${message.type}`);
      }),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await screen.findByText('Evening playlist');
    fireEvent.click(screen.getByRole('button', { name: 'Remove shortcut' }));
    const dialog = screen.getByRole('dialog', { name: 'Remove shortcut: Evening playlist' });
    expect(dialog).toHaveTextContent('The Home Assistant playlist itself will not be changed.');
    expect(within(dialog).getByRole('button', { name: 'Keep shortcut' })).toHaveFocus();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Remove shortcut' }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('The shortcut remains in your library, and the Home Assistant playlist is unchanged.');
    expect(screen.getByText('Evening playlist')).toBeVisible();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Remove shortcut' }));
    const removingButton = within(dialog).getByRole('button', { name: 'Removing shortcut...' });
    expect(removingButton).toBeDisabled();
    fireEvent.click(removingButton);
    expect(removeAttempts).toBe(2);
    expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/delete_provider',
      record_id: original.record_id,
      revision: 1,
    });
    expect(vi.mocked(hass.callWS).mock.calls.filter(([message]) => message.type === 'bl_haos/playlist_library/delete_provider')).toHaveLength(2);

    await act(async () => resolveRemoval(removed as unknown as BrowseMedia));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByText('Evening playlist')).not.toBeInTheDocument();
    expect(within(screen.getByRole('navigation', { name: 'Media views' })).getByRole('button', { name: 'Browse media' })).toHaveFocus();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('shows the exact empty section copy and wraps full provider labels with named actions', async () => {
    const longName = 'A very long saved Home Assistant provider playlist '.repeat(8).trim();
    const longRecord = providerRecord(longName);
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce({ revision: 0, records: [] } as unknown as BrowseMedia)
        .mockResolvedValueOnce(mediaRoot as unknown as BrowseMedia)
        .mockResolvedValueOnce({ revision: 1, records: [longRecord] } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    expect(await screen.findByText('No Home Assistant playlists saved. Browse media to save a playlist reference.')).toBeVisible();
    const navigation = within(screen.getByRole('navigation', { name: 'Media views' }));
    fireEvent.click(navigation.getByRole('button', { name: 'Browse media' }));
    expect(await screen.findByRole('button', { name: 'Save to library Evening playlist' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Save to library Evening playlist' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut' }));
    fireEvent.click(navigation.getByRole('button', { name: 'Library' }));
    await screen.findByText(longName);
    expect(document.querySelector('.provider-title')).toHaveTextContent(longName);
    expect(screen.getByRole('button', { name: 'Rename shortcut' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Remove shortcut' })).toBeEnabled();
  });

  it('allows a long provider title to use a shorter local shortcut name without changing its reference', async () => {
    const longTitle = 'é'.repeat(80);
    const longItem = { ...providerItem, title: longTitle };
    const longRoot = { ...mediaRoot, children: [longItem] };
    const saved = { revision: 1, records: [providerRecord('Summer list')] };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>().mockResolvedValueOnce(longRoot as unknown as BrowseMedia)
        .mockResolvedValueOnce(saved as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} initialView="browse" />);
    fireEvent.click(await screen.findByRole('button', { name: `Save to library ${longTitle}` }));
    expect(screen.getByRole('textbox', { name: 'Shortcut name' })).toHaveValue(longTitle);
    fireEvent.change(screen.getByRole('textbox', { name: 'Shortcut name' }), { target: { value: 'Summer list' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save shortcut' }));

    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/save_provider',
      media_content_id: mediaContentId,
      name: 'Summer list',
      title: longTitle,
      media_class: 'playlist',
      media_content_type: 'provider/playlist;opaque=Yes',
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Library' }));
    expect(await screen.findByText('Summer list')).toBeVisible();
  });

  it('checks exact custom and provider references only on request with independent pending and result states', async () => {
    const customReference = 'media-source://provider/custom%2Fopaque?order=a%2Bb';
    const providerReference = 'media-source://provider/playlist%2Fopaque?order=c%2Bd';
    const saved = {
      revision: 5,
      records: [
        {
          record_id: 'custom-record', record_revision: 2, kind: 'custom', name: 'Road mix',
          entries: [{
            media_content_id: customReference, title: 'Saved track',
            media_class: 'music', media_content_type: 'audio/mpeg',
          }],
        },
        { ...providerRecord(), media_content_id: providerReference },
      ],
    };
    let resolveCustomBrowse!: (value: BrowseMedia) => void;
    const customBrowse = new Promise<BrowseMedia>((resolve) => { resolveCustomBrowse = resolve; });
    const customResult: BrowseMedia = {
      title: 'Saved track', media_content_id: customReference, media_content_type: 'audio/mpeg',
      can_play: false, can_expand: false,
    };
    const callWS = vi.fn<Hass['callWS']>(async (message) => {
      if (message.type === 'bl_haos/playlist_library/list') return saved as unknown as BrowseMedia;
      if (message.type === 'media_source/browse_media') {
        if (message.media_content_id === customReference) return customBrowse;
        if (message.media_content_id === providerReference) throw new Error('provider error details must stay private');
      }
      throw new Error(`Unexpected request: ${message.type}`);
    });
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {}, callWS,
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    const providerRow = (await screen.findByText('Evening playlist')).closest('li') as HTMLElement;
    expect(within(providerRow).getByText('Not checked')).toBeVisible();
    expect(callWS.mock.calls.map(([message]) => message.type)).toEqual(['bl_haos/playlist_library/list']);

    fireEvent.click(screen.getByRole('button', { name: 'Edit playlist' }));
    const customRow = within(screen.getByRole('list', { name: 'Playlist entries' })).getAllByRole('listitem')[0];
    fireEvent.click(within(customRow).getByRole('button', { name: 'Check availability' }));
    const pendingCustomCheck = within(customRow).getByRole('button', { name: 'Checking availability...' });
    expect(pendingCustomCheck).toBeDisabled();
    fireEvent.click(pendingCustomCheck);
    expect(callWS.mock.calls.filter(([message]) => message.type === 'media_source/browse_media')).toHaveLength(1);
    expect(within(providerRow).getByRole('button', { name: 'Check availability' })).toBeEnabled();

    fireEvent.click(within(providerRow).getByRole('button', { name: 'Check availability' }));
    expect(await within(providerRow).findByText('Unavailable in Home Assistant.')).toBeVisible();
    expect(within(customRow).getByRole('button', { name: 'Checking availability...' })).toBeDisabled();
    await act(async () => resolveCustomBrowse(customResult));

    expect(within(customRow).getByText('Available in Home Assistant')).toBeVisible();
    expect(within(providerRow).getByText('Unavailable in Home Assistant.')).toBeVisible();
    expect(callWS.mock.calls.map(([message]) => message.type)).toEqual([
      'bl_haos/playlist_library/list',
      'media_source/browse_media',
      'media_source/browse_media',
    ]);
    expect(callWS.mock.calls.filter(([message]) => message.type === 'media_source/browse_media')
      .map(([message]) => message.type === 'media_source/browse_media' ? message.media_content_id : undefined))
      .toEqual([customReference, providerReference]);
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Road mix');
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('resets availability to Not checked after the panel is reloaded', async () => {
    const saved = { revision: 1, records: [providerRecord()] };
    const firstHass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce(saved as unknown as BrowseMedia)
        .mockResolvedValueOnce({ ...providerItem, can_play: false } as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };

    const panel = render(<MediaPanel hass={firstHass} />);
    const firstRow = (await screen.findByText('Evening playlist')).closest('li') as HTMLElement;
    fireEvent.click(within(firstRow).getByRole('button', { name: 'Check availability' }));
    expect(await within(firstRow).findByText('Available in Home Assistant')).toBeVisible();
    panel.unmount();

    const reloadedHass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>(async () => saved as unknown as BrowseMedia),
      callService: vi.fn(async () => undefined),
    };
    render(<MediaPanel hass={reloadedHass} />);
    const reloadedRow = (await screen.findByText('Evening playlist')).closest('li') as HTMLElement;
    expect(within(reloadedRow).getByText('Not checked')).toBeVisible();
    expect(reloadedHass.callWS).toHaveBeenCalledTimes(1);
    expect(reloadedHass.callService).not.toHaveBeenCalled();
  });

  it('does not imply an unsaved draft reference was persisted when availability fails', async () => {
    const root: BrowseMedia = {
      title: 'Media sources', media_content_id: 'media-source://', media_content_type: 'app',
      can_play: false, can_expand: true,
      children: [{ ...providerItem, title: 'Draft track', media_class: 'music', media_content_type: 'audio/mpeg' }],
    };
    const hass: Hass = {
      connection: { connected: true }, user: { id: 'local-user' }, states: {},
      callWS: vi.fn<Hass['callWS']>()
        .mockResolvedValueOnce({ revision: 0, records: [] } as unknown as BrowseMedia)
        .mockResolvedValueOnce(root)
        .mockRejectedValueOnce(new Error('media source unavailable')),
      callService: vi.fn(async () => undefined),
    };

    render(<MediaPanel hass={hass} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Create playlist' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Draft only' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add media' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Add media Draft track' }));

    const draftEntry = screen.getByRole('listitem');
    fireEvent.click(within(draftEntry).getByRole('button', { name: 'Check availability' }));

    expect(await within(draftEntry).findByText('Unavailable in Home Assistant.')).toBeVisible();
    expect(screen.queryByText(/saved reference was kept/i)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Playlist name' })).toHaveValue('Draft only');
    expect(screen.getByRole('button', { name: 'Save playlist' })).toBeEnabled();
    expect(vi.mocked(hass.callWS).mock.calls.map(([message]) => message.type)).toEqual([
      'bl_haos/playlist_library/list',
      'media_source/browse_media',
      'media_source/browse_media',
    ]);
    expect(hass.callService).not.toHaveBeenCalled();
  });
});