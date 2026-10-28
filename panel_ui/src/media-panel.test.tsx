import { act, cleanup, fireEvent, render as renderRTL, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { cloneElement, type ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MediaPanel, type BrowseMedia, type Hass, type MediaPanelElement } from './media-panel';

type PanelProps = { hass?: Hass; initialView?: 'library' | 'browse' };

const render = (element: ReactElement<PanelProps>) =>
  renderRTL(cloneElement(element, { initialView: 'browse' }));

const item: BrowseMedia = {
  title: 'Evening playlist',
  media_content_id: 'media-source://provider/opaque%2Fid?order=a%2Bb',
  media_content_type: 'provider/playlist;opaque=Yes',
  media_class: 'playlist',
  can_play: true,
  can_expand: false,
  thumbnail: '/api/image/serve/catalog/512x512',
};
const root: BrowseMedia = {
  title: 'Media sources', media_content_id: 'media-source://', media_content_type: 'app',
  can_play: false, can_expand: true, children: [item],
};

function injectedHass(): Hass {
  return {
    connection: { connected: true },
    user: { id: 'local-user' },
    states: {
      'media_player.kitchen': { entity_id: 'media_player.kitchen', state: 'idle', attributes: {
        friendly_name: 'Kitchen', bluetooth_address: 'aa:bb:cc:dd:ee:01', adapter: 'hci0',
      } },
      'media_player.office': { entity_id: 'media_player.office', state: 'playing', attributes: {
        friendly_name: 'Office', bluetooth_address: 'aa:bb:cc:dd:ee:02', adapter: 'hci1',
      } },
      'media_player.off': { entity_id: 'media_player.off', state: 'off', attributes: {
        bluetooth_address: 'aa:bb:cc:dd:ee:03', adapter: 'hci0',
      } },
      'media_player.other': { entity_id: 'media_player.other', state: 'playing', attributes: {} },
      'sensor.impostor': { entity_id: 'sensor.impostor', state: 'idle', attributes: {
        bluetooth_address: 'aa:bb:cc:dd:ee:04', adapter: 'hci0',
      } },
    },
    callWS: vi.fn<Hass['callWS']>(async (message) => message.type === 'bl_haos/playlist_library/list'
      ? { revision: 0, records: [] } : root),
    callService: vi.fn(async () => undefined),
  };
}

function deferred<Result>() {
  let resolve!: (value: Result) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<Result>((accept, decline) => { resolve = accept; reject = decline; });
  return { promise, resolve, reject };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('injected Home Assistant tracer', () => {
  it('has 44px controls, constrained scrolling, two-line titles and reduced-motion styles', async () => {
    const panel = document.createElement('bl-haos-media-panel') as MediaPanelElement;
    await act(async () => { document.body.append(panel); panel.hass = injectedHass(); });
    const style = panel.shadowRoot!.querySelector('style')!.textContent!;
    expect(style).toContain('min-height:44px');
    expect(style).toMatch(/\.catalog-path button\s*\{[^}]*min-width:44px/);
    expect(style).toMatch(/\.catalog-body\s*\{[^}]*overflow-y:auto/);
    expect(style).toMatch(/\.neu-surface\s*\{[^}]*min-height:160px/);
    expect(style).toContain('-webkit-line-clamp:2');
    expect(style).toContain(':focus-visible');
    expect(style).toContain('transition:background-color 150ms');
    expect(style).toContain('@media(prefers-reduced-motion:reduce)');
    expect(style).toContain('transition:none !important');
    expect(style).toMatch(/\.selected-target\s*\{[^}]*overflow-wrap:anywhere/);
    await act(async () => { panel.remove(); });
  });

  it('queue launch uses one saved record on one explicitly selected connected speaker', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockResolvedValue({
      revision: 1,
      records: [{
        record_id: 'saved-record-id', record_revision: 1, kind: 'custom', name: 'Quiet hours',
        entries: [{ media_content_id: 'media-source://provider/opaque', title: 'First item' }],
      }],
    } as never);
    renderRTL(<MediaPanel hass={hass} initialView="library" />);

    await screen.findByText('Quiet hours');
    const target = screen.getByRole('combobox', { name: 'Play on' });
    expect(target).toHaveValue('');
    expect(within(target).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Select a connected speaker', 'Kitchen', 'Office',
    ]);
    const launch = screen.getByRole('button', { name: 'Play playlist Quiet hours' });
    expect(launch).toBeDisabled();

    fireEvent.change(target, { target: { value: 'media_player.kitchen' } });
    fireEvent.click(launch);

    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/start',
      record_id: 'saved-record-id',
      entity_id: 'media_player.kitchen',
    }));
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('queue replacement requires confirmation and restores focus when cancelled', async () => {
    const hass = injectedHass();
    hass.states['media_player.kitchen'].attributes.queue = {
      status: 'playing', playlist: 'Current mix', title: 'Current item', index: 1, count: 2,
    };
    vi.mocked(hass.callWS).mockResolvedValue({
      revision: 1,
      records: [{
        record_id: 'saved-record-id', record_revision: 1, kind: 'custom', name: 'Quiet hours',
        entries: [{ media_content_id: 'media-source://provider/opaque', title: 'First item' }],
      }],
    } as never);
    renderRTL(<MediaPanel hass={hass} initialView="library" />);

    await screen.findByText('Quiet hours');
    fireEvent.change(screen.getByRole('combobox', { name: 'Play on' }), { target: { value: 'media_player.kitchen' } });
    const launch = screen.getByRole('button', { name: 'Play playlist Quiet hours' });
    fireEvent.click(launch);

    const dialog = screen.getByRole('dialog', { name: 'Replace queue' });
    expect(dialog).toHaveTextContent('Stop the current queue on Kitchen and play “Quiet hours”?');
    expect(screen.getByRole('button', { name: 'Keep current queue' })).toHaveFocus();
    await userEvent.setup().keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launch).toHaveFocus();

    fireEvent.click(launch);
    fireEvent.click(screen.getByRole('button', { name: 'Replace queue' }));
    await waitFor(() => expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'bl_haos/playlist_library/start', record_id: 'saved-record-id', entity_id: 'media_player.kitchen',
    }));
  });

  it('renders only the selected speaker queue snapshot and never a playback URL', async () => {
    const hass = injectedHass();
    hass.states['media_player.kitchen'].attributes.queue = {
      status: 'playing', playlist: 'Current mix', title: 'Current item', artist: 'Current artist',
      index: 2, count: 4, position: 8, duration: 90, shuffle: true, repeat: 'all',
      url: 'https://private.invalid/audio?token=sentinel',
    };
    renderRTL(<MediaPanel hass={hass} initialView="library" />);

    await screen.findByText('No active queue. Select a connected speaker to view playback.');
    fireEvent.change(screen.getByRole('combobox', { name: 'Play on' }), { target: { value: 'media_player.kitchen' } });

    expect(await screen.findByText('Current mix')).toBeVisible();
    expect(screen.getByText('Current item')).toBeVisible();
    expect(screen.getByText('Item 2 of 4')).toBeVisible();
    expect(screen.getByText('0:08 / 1:30')).toBeVisible();
    expect(screen.getByText('playing · Shuffle on · Repeat all')).toBeVisible();
    expect(document.body).not.toHaveTextContent('private.invalid');
    expect(document.body).not.toHaveTextContent('sentinel');
  });

  it('keeps the last confirmed queue visible during and after a bounded launch failure', async () => {
    const hass = injectedHass();
    hass.states['media_player.kitchen'].attributes.queue = {
      status: 'playing', playlist: 'Current mix', title: 'Current item', index: 1, count: 2,
    };
    const start = deferred<unknown>();
    const library = {
      revision: 1,
      records: [{
        record_id: 'saved-record-id', record_revision: 1, kind: 'custom', name: 'Quiet hours',
        entries: [{ media_content_id: 'media-source://provider/opaque', title: 'First item' }],
      }],
    };
    vi.mocked(hass.callWS).mockImplementation(async (message) => {
      if (message.type === 'bl_haos/playlist_library/list') return library as never;
      return start.promise as never;
    });
    renderRTL(<MediaPanel hass={hass} initialView="library" />);

    await screen.findByText('Quiet hours');
    fireEvent.change(screen.getByRole('combobox', { name: 'Play on' }), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play playlist Quiet hours' }));
    fireEvent.click(screen.getByRole('button', { name: 'Replace queue' }));

    const dialog = screen.getByRole('dialog', { name: 'Replace queue' });
    expect(await within(dialog).findByRole('status')).toHaveTextContent('Preparing');
    expect(screen.getByText('Current mix')).toBeVisible();
    expect(screen.getByText('Item 1 of 2')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Preparing...' })).toBeDisabled();
    await act(async () => { start.reject(new Error('https://private.invalid/item?token=sentinel')); });

    const failure = await within(dialog).findByRole('alert');
    expect(failure).toHaveTextContent('Couldn\'t confirm');
    expect(failure).not.toHaveTextContent('private.invalid');
    expect(failure).not.toHaveTextContent('sentinel');
    expect(screen.getByText('Current mix')).toBeVisible();
    expect(screen.getByText('Item 1 of 2')).toBeVisible();
    expect(hass.callWS).toHaveBeenCalledTimes(2);
  });

  it('restores focus to the parent source on Escape and preserves target selection', async () => {
    const user = userEvent.setup();
    const hass = injectedHass();
    const folder = { ...root, title: 'Provider', media_content_id: 'media-source://provider/folder' };
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, children: [folder] }).mockResolvedValueOnce(folder);
    render(<MediaPanel hass={hass} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    await user.click(await screen.findByRole('button', { name: 'Open Provider' }));
    await screen.findByRole('heading', { name: 'Provider' });
    screen.getByRole('button', { name: 'Back' }).focus();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open Provider' })).toHaveFocus();
    expect(screen.getByRole('combobox')).toHaveValue('media_player.kitchen');
    expect(hass.callWS).toHaveBeenCalledTimes(2);
  });

  it('moves focus to Back after keyboard expansion so Escape remains operable', async () => {
    const user = userEvent.setup();
    const hass = injectedHass();
    const folder: BrowseMedia = { ...item, title: 'Provider', can_play: false, can_expand: true };
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, children: [folder] }).mockResolvedValueOnce(folder);
    render(<MediaPanel hass={hass} />);
    const open = await screen.findByRole('button', { name: 'Open Provider' });
    open.focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('heading', { name: 'Provider' });
    expect(screen.getByRole('button', { name: 'Back' })).toHaveFocus();
    await user.keyboard('{Escape}');
    await screen.findByRole('heading', { name: 'Media sources' });
    expect(screen.getByRole('button', { name: 'Open Provider' })).toHaveFocus();
  });

  it('navigates through the Close link only after confirming discard', async () => {
    const hass = injectedHass();
    renderRTL(<MediaPanel hass={hass} initialView="library" />);
    await screen.findByRole('heading', { name: 'Your playlists' });
    fireEvent.click(screen.getByRole('button', { name: 'Create playlist' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Playlist name' }), { target: { value: 'Unsaved draft' } });

    const closeLink = screen.getByRole('link', { name: 'Close catalog' });
    const navigate = vi.spyOn(closeLink, 'click').mockImplementation(() => {});
    fireEvent.click(closeLink);
    const dialog = screen.getByRole('dialog', { name: 'Discard changes' });
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Discard changes' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1));
  });

  it('keeps unavailable target and item labels and disables manual retry without substitution', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callService).mockRejectedValue(new Error('private'));
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: `Play ${item.title}` }));
    await screen.findByRole('button', { name: `Retry ${item.title} on Kitchen` });
    view.rerender(<MediaPanel hass={{ ...hass, states: {
      ...hass.states, 'media_player.kitchen': { ...hass.states['media_player.kitchen'], state: 'unavailable' },
    } }} />);
    expect(screen.getByText('Kitchen is unavailable. Select a connected speaker to play media.')).toBeVisible();
    expect(screen.getByRole('combobox')).toHaveValue('media_player.kitchen');
    const retry = screen.getByRole('button', { name: `Retry ${item.title} on Kitchen` });
    expect(retry).toBeDisabled();
    fireEvent.click(retry);
    expect(hass.callService).toHaveBeenCalledTimes(1);
  });

  it('preserves root browse recovery after target selection and retries only manually', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockRejectedValueOnce(new Error('private root failure')).mockResolvedValueOnce(root);
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByRole('button', { name: 'Retry media sources' });
    const alert = screen.getByRole('alert').textContent;
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    view.rerender(<MediaPanel hass={{ ...hass, states: { ...hass.states } }} />);
    expect(screen.getByRole('alert')).toHaveTextContent(alert!);
    expect(screen.getByRole('alert')).not.toHaveTextContent('private root failure');
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('combobox')).toHaveValue('media_player.kitchen');
    fireEvent.click(screen.getByRole('button', { name: 'Retry media sources' }));
    await screen.findByText(item.title);
    expect(hass.callWS).toHaveBeenCalledTimes(2);
    expect(vi.mocked(hass.callWS).mock.calls[1]).toEqual(vi.mocked(hass.callWS).mock.calls[0]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('retains hierarchy on search failure and retries the captured query only manually', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, can_search: true })
      .mockRejectedValueOnce(new Error('secret')).mockResolvedValueOnce({ result: [] });
    render(<MediaPanel hass={hass} />);
    const search = await screen.findByRole('searchbox');
    fireEvent.change(search, { target: { value: 'original' } });
    fireEvent.submit(search.closest('form')!);
    const retry = await screen.findByRole('button', { name: 'Retry search' });
    expect(screen.getByText(item.title)).toBeVisible();
    fireEvent.change(search, { target: { value: 'different' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    expect(screen.getByRole('alert')).toHaveTextContent('Your Home Assistant session cannot access this media source.');
    expect(screen.getByRole('button', { name: 'Retry search' })).toBeVisible();
    expect(hass.callWS).toHaveBeenCalledTimes(2);
    fireEvent.click(retry);
    await screen.findByText('No audio sources are available');
    expect(hass.callWS).toHaveBeenLastCalledWith({ type: 'media_source/search_media', media_content_id: root.media_content_id, search_query: 'original' });
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('ignores old-session search results and preserves full long-title accessible labels', async () => {
    const hass = injectedHass();
    const searchResult = deferred<{ result: BrowseMedia[] }>();
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, can_search: true }).mockReturnValueOnce(searchResult.promise);
    const view = render(<MediaPanel hass={hass} />);
    const search = await screen.findByRole('searchbox');
    fireEvent.change(search, { target: { value: 'original' } });
    fireEvent.submit(search.closest('form')!);
    const replacement = injectedHass();
    const longTitle = 'A very long provider playlist title '.repeat(12).trim();
    vi.mocked(replacement.callWS).mockResolvedValue({ ...root, children: [{ ...item, title: longTitle }] });
    view.rerender(<MediaPanel hass={replacement} />);
    expect(await screen.findByRole('button', { name: `Play ${longTitle}` })).toBeVisible();
    await act(async () => { searchResult.resolve({ result: [{ ...item, title: 'OLD SEARCH' }] }); });
    expect(screen.queryByText('OLD SEARCH')).not.toBeInTheDocument();
    expect(screen.getByTitle(longTitle)).toBeInTheDocument();
  });

  it('shows complete empty copy for absent children without choosing a target', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockResolvedValue({ ...root, children: undefined });
    render(<MediaPanel hass={hass} />);
    expect(await screen.findByText('No audio sources are available')).toBeVisible();
    expect(screen.getByText('Home Assistant did not return a playable audio source. Check the media provider and try again.')).toBeVisible();
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('offers one manual same-item same-target retry and removes it when target changes', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callService).mockRejectedValueOnce(new Error('secret')).mockResolvedValue(undefined);
    render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: `Play ${item.title}` }));
    const retry = await screen.findByRole('button', { name: `Retry ${item.title} on Kitchen` });
    expect(screen.getByRole('alert')).toHaveTextContent('Home Assistant could not play this item on Kitchen. Check the provider access and speaker connection, then try again.');
    expect(hass.callService).toHaveBeenCalledTimes(1);
    fireEvent.click(retry);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Starting playback on Kitchen'));
    expect(hass.callService).toHaveBeenCalledTimes(2);
    expect(vi.mocked(hass.callService).mock.calls[1]).toEqual(vi.mocked(hass.callService).mock.calls[0]);
    expect(screen.queryByRole('button', { name: /^Retry / })).not.toBeInTheDocument();
    expect(hass.callWS).toHaveBeenCalledTimes(1);
  });

  it('retains failed item selection but invalidates retry after selecting another target', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callService).mockRejectedValue(new Error('secret'));
    render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: `Play ${item.title}` }));
    await screen.findByRole('button', { name: `Retry ${item.title} on Kitchen` });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.office' } });
    expect(screen.queryByRole('button', { name: /^Retry / })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'true');
    expect(hass.callService).toHaveBeenCalledTimes(1);
  });

  it('keeps stable ancestors on child failure and retries only that browse request', async () => {
    const hass = injectedHass();
    const folder = { ...item, media_content_id: 'media-source://provider/folder', title: 'Provider', can_expand: true, can_play: false };
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, children: [folder, item] })
      .mockRejectedValueOnce(new Error('secret')).mockResolvedValueOnce({ ...root, title: 'Provider' });
    render(<MediaPanel hass={hass} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open Provider' }));
    const retry = await screen.findByRole('button', { name: 'Retry opening Provider' });
    expect(screen.getByRole('button', { name: `Play ${item.title}` })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    expect(screen.getByRole('button', { name: 'Retry opening Provider' })).toBeVisible();
    expect(hass.callWS).toHaveBeenCalledTimes(2);
    fireEvent.click(retry);
    await screen.findByRole('heading', { name: 'Provider' });
    expect(hass.callWS).toHaveBeenCalledTimes(3);
    expect(vi.mocked(hass.callWS).mock.calls[2]).toEqual(vi.mocked(hass.callWS).mock.calls[1]);
    expect(screen.getByRole('navigation', { name: 'Catalog path' })).toHaveTextContent('Media sources');
  });

  it('searches only advertised capability using the exact Core 2026.10.3 public schema', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, can_search: true })
      .mockResolvedValueOnce({ result: [item] } as unknown as BrowseMedia);
    render(<MediaPanel hass={hass} />);
    const search = await screen.findByRole('searchbox', { name: 'Search media' });
    fireEvent.change(search, { target: { value: 'evening' } });
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    fireEvent.submit(search.closest('form')!);
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledTimes(2));
    expect(hass.callWS).toHaveBeenLastCalledWith({ type: 'media_source/search_media', media_content_id: root.media_content_id, search_query: 'evening' });
    expect(await screen.findByText(item.title)).toBeVisible();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('hides search without capability and shows unsupported source copy', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockResolvedValue({ ...root, children: [{ ...item, can_play: false }] });
    render(<MediaPanel hass={hass} />);
    expect(await screen.findByText('This source cannot play audio on a BL-HAOS speaker. Choose an audio item or provider playlist.')).toBeVisible();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: `Play ${item.title}` })).not.toBeInTheDocument();
  });

  it('keeps hierarchy during loading and disables playback until the request settles', async () => {
    const hass = injectedHass();
    const child = deferred<BrowseMedia>();
    const folder = { ...item, media_content_id: 'media-source://provider/folder', title: 'Provider', can_expand: true, can_play: false };
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, children: [folder, item] }).mockReturnValueOnce(child.promise);
    render(<MediaPanel hass={hass} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open Provider' }));
    expect(screen.getByText(item.title)).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Loading media sources...');
    expect(screen.getByRole('button', { name: `Play ${item.title}` })).toBeDisabled();
    await act(async () => { child.resolve({ ...root, title: 'Provider' }); });
    expect(screen.getByRole('navigation', { name: 'Catalog path' })).toBeVisible();
  });

  it.each(['connection', 'user'] as const)('discards pending browse on session %s replacement', async (identity) => {
    const old = injectedHass();
    const browse = deferred<BrowseMedia>();
    vi.mocked(old.callWS).mockReturnValue(browse.promise);
    const view = render(<MediaPanel hass={old} />);
    const replacement = injectedHass();
    if (identity === 'user') {
      replacement.connection = old.connection;
      replacement.user = { id: 'replacement-user' };
    }
    vi.mocked(replacement.callWS).mockResolvedValue({ ...root, title: 'NEW SESSION' });
    view.rerender(<MediaPanel hass={replacement} />);
    await act(async () => { browse.resolve({ ...root, title: 'OLD SESSION' }); });
    expect(await screen.findByRole('heading', { name: 'NEW SESSION' })).toBeVisible();
    expect(screen.queryByText('OLD SESSION')).not.toBeInTheDocument();
    expect(replacement.callWS).toHaveBeenCalledTimes(1);
  });

  it.each(['loss', 'replacement', 'disconnect'] as const)(
    'discards pending play completion after session %s and clears selection', async (change) => {
      const hass = injectedHass();
      const playback = deferred<unknown>();
      vi.mocked(hass.callService).mockReturnValue(playback.promise);
      const view = render(<MediaPanel hass={hass} />);
      await screen.findByText(item.title);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
      fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
      const replacement = change === 'replacement' ? injectedHass()
        : change === 'disconnect' ? { ...hass, connection: { connected: false } } : undefined;
      view.rerender(<MediaPanel hass={replacement} />);
      await act(async () => { playback.resolve(undefined); });
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
      expect(screen.getByRole('combobox')).toHaveValue('');
      if (change !== 'replacement') expect(screen.getByRole('alert')).toHaveTextContent('session is unavailable');
    },
  );

  it('discards late play errors without clearing a replacement session pending operation', async () => {
    const hass = injectedHass();
    const oldPlay = deferred<unknown>();
    vi.mocked(hass.callService).mockReturnValue(oldPlay.promise);
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
    const replacement = injectedHass();
    const newPlay = deferred<unknown>();
    vi.mocked(replacement.callService).mockReturnValue(newPlay.promise);
    view.rerender(<MediaPanel hass={replacement} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.office' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
    expect(replacement.callService).toHaveBeenCalledTimes(1);
    await act(async () => { oldPlay.reject(new Error('secret provider response')); });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
    await act(async () => { newPlay.resolve(undefined); });
    expect(screen.getByRole('status')).toHaveTextContent('Starting playback on Office');
  });

  it('uses current state and methods without reloading for normal hass updates', async () => {
    const hass = injectedHass();
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    const updated = { ...hass, user: { ...hass.user }, callService: vi.fn(async () => undefined), states: { ...hass.states } };
    view.rerender(<MediaPanel hass={updated} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
    await waitFor(() => expect(updated.callService).toHaveBeenCalledTimes(1));
    expect(hass.callService).not.toHaveBeenCalled();
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('combobox')).toHaveValue('media_player.kitchen');
  });

  it('discards browse errors across loss and reconnection of the same connection', async () => {
    const hass = injectedHass();
    const browse = deferred<BrowseMedia>();
    vi.mocked(hass.callWS).mockReturnValueOnce(browse.promise).mockResolvedValue(root);
    const view = render(<MediaPanel hass={hass} />);
    hass.connection.connected = false;
    view.rerender(<MediaPanel hass={{ ...hass }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('session is unavailable');
    expect(screen.queryByText('Loading media sources...')).not.toBeInTheDocument();
    hass.connection.connected = true;
    view.rerender(<MediaPanel hass={{ ...hass }} />);
    await screen.findByText(item.title);
    await act(async () => { browse.reject(new Error('secret prior-session response')); });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(hass.callWS).toHaveBeenCalledTimes(2);
  });

  it('uses current speaker connectivity when a pending service completes', async () => {
    const hass = injectedHass();
    const playback = deferred<unknown>();
    vi.mocked(hass.callService).mockReturnValue(playback.promise);
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
    view.rerender(<MediaPanel hass={{ ...hass, states: {
      ...hass.states, 'media_player.kitchen': { ...hass.states['media_player.kitchen'], state: 'unavailable' },
    } }} />);
    await act(async () => { playback.resolve(undefined); });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('alert')).toHaveTextContent('selected speaker is unavailable');
    expect(hass.callWS).toHaveBeenCalledTimes(1);
  });

  it('keeps the latest same-session browse authoritative when results arrive out of order', async () => {
    const hass = injectedHass();
    const first = deferred<BrowseMedia>();
    const last = deferred<BrowseMedia>();
    const folder = { ...item, title: 'Provider', can_play: false, can_expand: true };
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, children: [folder] })
      .mockReturnValueOnce(first.promise).mockReturnValueOnce(last.promise);
    render(<MediaPanel hass={hass} />);
    const open = await screen.findByRole('button', { name: 'Open Provider' });
    act(() => { open.click(); open.click(); });
    expect(hass.callWS).toHaveBeenCalledTimes(3);
    await act(async () => { last.resolve({ ...root, title: 'LATEST' }); });
    await act(async () => { first.resolve({ ...root, title: 'STALE' }); });
    expect(screen.getByRole('heading', { name: 'LATEST' })).toBeVisible();
    expect(screen.queryByText('STALE')).not.toBeInTheDocument();
  });

  it.each([
    '/\\outside.review.invalid/tracker.png',
    '//outside.review.invalid/tracker.png',
    '//ha.invalid/tracker.png',
    '///outside.review.invalid/tracker.png',
    '/safe/..//outside.review.invalid/tracker.png',
    '/\t/outside.review.invalid/tracker.png',
    '/\n/outside.review.invalid/tracker.png',
    '/\r/outside.review.invalid/tracker.png',
    '/api/image/\u0000tracker.png',
    'https://outside.review.invalid/tracker.png',
    'javascript:alert(1)',
  ])('rejects unsafe thumbnail URL %j', async (thumbnail) => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockResolvedValue({ ...root, children: [{ ...item, thumbnail }] });
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    expect(view.container.querySelector('img')).toBeNull();
  });

  it('preserves HA thumbnail paths without copying session authentication', async () => {
    const hass = injectedHass();
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    expect(view.container.querySelector('img')).toHaveAttribute('src', item.thumbnail);
    expect(view.container.querySelector('img')).toHaveAttribute('referrerpolicy', 'no-referrer');
  });

  it('browses through hass and submits the unchanged reference to exactly one explicit target', async () => {
    const hass = injectedHass();
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const persistenceRead = vi.spyOn(Storage.prototype, 'getItem');
    const persistenceWrite = vi.spyOn(Storage.prototype, 'setItem');
    render(<MediaPanel hass={hass} />);
    expect(await screen.findByText(item.title)).toBeVisible();
    expect(hass.callWS).toHaveBeenCalledExactlyOnceWith({ type: 'media_source/browse_media' });
    expect(screen.getByRole('button', { name: 'Play Evening playlist' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Play on' })).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
    await waitFor(() => expect(hass.callService).toHaveBeenCalledExactlyOnceWith(
      'media_player', 'play_media',
      { media_content_id: item.media_content_id, media_content_type: item.media_content_type },
      { entity_id: 'media_player.kitchen' },
    ));
    expect(await screen.findByRole('status')).toHaveTextContent('Starting playback on Kitchen');
    expect(fetch).not.toHaveBeenCalled();
    expect(persistenceRead).not.toHaveBeenCalled();
    expect(persistenceWrite).not.toHaveBeenCalled();
  });

  it('accepts only the custom element hass property, including delayed injection and reconnection', async () => {
    const panel = document.createElement('bl-haos-media-panel') as MediaPanelElement;
    await act(async () => { document.body.append(panel); });
    const hass = injectedHass();
    await act(async () => { panel.hass = hass; });
    await waitFor(() => expect(within(panel.shadowRoot as unknown as HTMLElement).getByRole('heading', { name: 'Media Library' })).toBeVisible());
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    await act(async () => { panel.remove(); });
    await act(async () => { document.body.append(panel); });
    await waitFor(() => expect(hass.callWS).toHaveBeenCalledTimes(2));
    await act(async () => { panel.remove(); });
  });

  it('rechecks target connectivity from current injected state before play', async () => {
    const hass = injectedHass();
    const view = render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.kitchen' } });
    view.rerender(<MediaPanel hass={{ ...hass, states: {
      ...hass.states, 'media_player.kitchen': { ...hass.states['media_player.kitchen'], state: 'unavailable' },
    } }} />);
    expect(screen.getByRole('button', { name: 'Play Evening playlist' })).toBeDisabled();
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('keeps service errors bounded without fallback or automatic retry', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callService).mockRejectedValue(new Error('https://secret.invalid/path?token=sentinel'));
    render(<MediaPanel hass={hass} />);
    await screen.findByText(item.title);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'media_player.office' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play Evening playlist' }));
    expect(await screen.findByRole('alert')).not.toHaveTextContent('sentinel');
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('combobox')).toHaveValue('media_player.office');
  });

  it('fails closed on denied browsing without reflecting provider error text or invoking another boundary', async () => {
    const hass = injectedHass();
    vi.mocked(hass.callWS).mockRejectedValue(new Error('auth_invalid https://secret.invalid/path?token=sentinel'));
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const persistenceRead = vi.spyOn(Storage.prototype, 'getItem');
    const persistenceWrite = vi.spyOn(Storage.prototype, 'setItem');
    render(<MediaPanel hass={hass} />);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Your Home Assistant session cannot access this media source');
    expect(alert).not.toHaveTextContent('sentinel');
    expect(hass.callWS).toHaveBeenCalledExactlyOnceWith({ type: 'media_source/browse_media' });
    expect(hass.callService).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(persistenceRead).not.toHaveBeenCalled();
    expect(persistenceWrite).not.toHaveBeenCalled();
  });

  it('navigates only expandable references and never transforms opaque browse IDs', async () => {
    const hass = injectedHass();
    const folder = { ...item, title: 'Provider', can_play: false, can_expand: true };
    vi.mocked(hass.callWS).mockResolvedValueOnce({ ...root, children: [folder] }).mockResolvedValueOnce(root);
    render(<MediaPanel hass={hass} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open Provider' }));
    await screen.findByText(item.title);
    expect(hass.callWS).toHaveBeenLastCalledWith({
      type: 'media_source/browse_media', media_content_id: folder.media_content_id,
    });
  });
});