import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowUp, ChevronRight, Music2, Play, Search, X } from 'lucide-react';
import { SpeakerManagement } from './speaker-management';

export interface BrowseMedia {
  title: string;
  media_content_id: string;
  media_content_type: string;
  media_class?: string;
  can_play: boolean;
  can_expand: boolean;
  can_search?: boolean;
  search_media_classes?: string[] | null;
  thumbnail?: string | null;
  children?: BrowseMedia[];
}

interface PlaylistEntry {
  media_content_id: string;
  title?: string;
  media_class?: string;
  media_content_type?: string;
}

interface PlaylistRecordBase {
  record_id: string;
  record_revision: number;
  name: string;
}

interface CustomPlaylistRecord extends PlaylistRecordBase {
  kind: 'custom';
  entries: PlaylistEntry[];
}

interface ProviderPlaylistRecord extends PlaylistRecordBase {
  kind: 'provider';
  media_content_id: string;
  title?: string;
  media_class?: string;
  media_content_type?: string;
}

type PlaylistRecord = CustomPlaylistRecord | ProviderPlaylistRecord;

interface PlaylistLibrarySnapshot {
  revision: number;
  records: PlaylistRecord[];
}

interface EntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

interface QueueSnapshot {
  status?: string;
  playlist?: string;
  title?: string;
  artist?: string;
  index?: number;
  count?: number;
  position?: number;
  duration?: number;
  shuffle?: boolean;
  repeat?: string;
  error?: string | null;
}

function queueSnapshot(entity?: EntityState): QueueSnapshot | undefined {
  const queue = entity?.attributes.queue;
  return queue && typeof queue === 'object' ? queue as QueueSnapshot : undefined;
}

function hasActiveQueue(queue?: QueueSnapshot): boolean {
  return queue?.status === 'playing' || queue?.status === 'paused' || queue?.status === 'failed';
}

function formatTime(seconds: unknown): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return 'Time unavailable';
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export interface Hass {
  connection: { connected: boolean };
  user: { id: string };
  states: Record<string, EntityState>;
  fetchWithAuth?(path: string, init?: RequestInit): Promise<Response>;
  callWS(message:
    | { type: 'media_source/browse_media'; media_content_id?: string }
    | { type: 'media_source/search_media'; media_content_id: string; search_query: string }
    | { type: 'bl_haos/playlist_library/list' }
    | { type: 'bl_haos/playlist_library/save_custom' | 'bl_haos/playlist_library/update_custom'; record_id: string; name: string; entries: PlaylistEntry[]; revision: number }
    | { type: 'bl_haos/playlist_library/delete_custom'; record_id: string; revision: number }
    | { type: 'bl_haos/playlist_library/save_provider'; media_content_id: string; name: string; title?: string; media_class?: string; media_content_type?: string }
    | { type: 'bl_haos/playlist_library/rename_provider'; record_id: string; name: string; revision: number }
    | { type: 'bl_haos/playlist_library/delete_provider'; record_id: string; revision: number }
    | { type: 'bl_haos/playlist_library/start'; record_id: string; entity_id: string }
    | { type: 'bl_haos/speakers/devices' | 'bl_haos/speakers/settings/get' | 'bl_haos/speakers/adapters/list' }
    | { type: 'bl_haos/speakers/scan'; start: boolean; adapter_name?: string }
    | { type: 'bl_haos/speakers/pair'; address: string; pin?: string }
    | { type: 'bl_haos/speakers/connect' | 'bl_haos/speakers/disconnect' | 'bl_haos/speakers/remove'; address: string }
    | { type: 'bl_haos/speakers/settings/update'; address: string; custom_alias?: string; auto_reconnect?: boolean; preferred_adapter?: string | null; default_volume?: number; codec_override?: string | null }
    | { type: 'bl_haos/speakers/system-settings/update'; log_level?: string; default_codec?: string; auto_reconnect_enabled?: boolean }
    | { type: 'bl_haos/speakers/adapters/power'; adapter_name: string; powered: boolean }
  ): Promise<BrowseMedia | { result: BrowseMedia[] } | PlaylistLibrarySnapshot>;
  callService(
    domain: 'media_player',
    service: 'play_media',
    data: { media_content_id: string; media_content_type: string },
    target: { entity_id: string },
  ): Promise<unknown>;
}

function isConnectedTarget(entity: EntityState): boolean {
  return entity.entity_id.startsWith('media_player.')
    && typeof entity.attributes.bluetooth_address === 'string'
    && /^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(entity.attributes.bluetooth_address)
    && typeof entity.attributes.adapter === 'string'
    && entity.attributes.adapter.trim().length > 0
    && ['idle', 'playing', 'paused'].includes(entity.state);
}

function entityName(entity: EntityState): string {
  return typeof entity.attributes.friendly_name === 'string'
    ? entity.attributes.friendly_name : entity.entity_id;
}

function isCustomRecord(record: PlaylistRecord): record is CustomPlaylistRecord {
  return record.kind === 'custom';
}

function isProviderRecord(record: PlaylistRecord): record is ProviderPlaylistRecord {
  return record.kind === 'provider';
}

function isProviderPlaylist(item: BrowseMedia): boolean {
  return item.media_class?.toLowerCase() === 'playlist'
    || item.media_content_type.toLowerCase().includes('playlist');
}

function thumbnailPath(candidate?: string | null): string | undefined {
  if (!candidate?.startsWith('/') || candidate.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(candidate)) return;
  try {
    const origin = 'https://ha.invalid';
    const parsed = new URL(candidate, origin);
    if (parsed.origin !== origin || parsed.protocol !== 'https:' || parsed.username || parsed.password) return;
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    if (path.startsWith('//')) return;
    return path;
  } catch {
    return;
  }
}

function MediaThumbnail({ hass, thumbnail }: { hass?: Hass; thumbnail?: string | null }) {
  const path = thumbnailPath(thumbnail);
  const connection = hass?.connection;
  const connected = connection?.connected;
  const userId = hass?.user.id;
  const fetchWithAuth = hass?.fetchWithAuth;
  const [result, setResult] = useState<{
    path: string;
    connection: Hass['connection'];
    userId: string;
    fetchWithAuth: Hass['fetchWithAuth'];
    url?: string;
    failed: boolean;
  }>();

  useEffect(() => {
    if (!path || !connection || !connected || !userId || !fetchWithAuth) return;
    const controller = new AbortController();
    let active = true;
    let objectUrl: string | undefined;
    const owner = { path, connection, userId, fetchWithAuth };
    void (async () => {
      try {
        const response = await fetchWithAuth(path, { signal: controller.signal, redirect: 'error' });
        if (!response.ok) throw new Error('Artwork request failed');
        const blob = await response.blob();
        if (!blob.type.startsWith('image/') || !blob.size) throw new Error('Invalid artwork response');
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setResult({ ...owner, url: objectUrl, failed: false });
      } catch {
        if (active && !controller.signal.aborted) setResult({ ...owner, failed: true });
      }
    })();
    return () => {
      active = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path, connection, connected, userId, fetchWithAuth]);

  const current = connected && result?.path === path && result?.connection === connection
    && result?.userId === userId && result?.fetchWithAuth === fetchWithAuth ? result : undefined;
  if (current?.url && !current.failed) {
    return <img className="thumbnail" src={current.url} alt="" loading="lazy" referrerPolicy="no-referrer"
      onError={() => setResult({ ...current, failed: true })} />;
  }
  if (path && (!fetchWithAuth || current?.failed)) {
    return <span className="media-icon" role="img" aria-label="Artwork unavailable" title="Artwork unavailable">
      <Music2 size={24} aria-hidden="true" />
    </span>;
  }
  return <Music2 className="media-icon" size={24} aria-hidden="true" />;
}

const accessError = 'Your Home Assistant session cannot access this media source. Reconnect or ask an administrator for access, then try again.';
const unsupported = 'This source cannot play audio on a BL-HAOS speaker. Choose an audio item or provider playlist.';
interface BrowseRequest { item?: BrowseMedia; path: BrowseMedia[]; query?: string }

export function MediaPanel({ hass, initialView = 'library' }: { hass?: Hass; initialView?: 'library' | 'browse' }) {
  const initialViewRef = useRef(initialView);
  const [view, setView] = useState<'library' | 'browse'>(initialView);
  const [panelTab, setPanelTab] = useState<'media' | 'speakers'>('media');
  const [library, setLibrary] = useState<PlaylistLibrarySnapshot>();
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState('');
  const [libraryStatus, setLibraryStatus] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CustomPlaylistRecord>();
  const [draftName, setDraftName] = useState('');
  const [draftEntries, setDraftEntries] = useState<PlaylistEntry[]>([]);
  const [draftEntryKeys, setDraftEntryKeys] = useState<string[]>([]);
  const [draftError, setDraftError] = useState('');
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftConflict, setDraftConflict] = useState(false);
  const [picker, setPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<CustomPlaylistRecord>();
  const [confirmProviderRemove, setConfirmProviderRemove] = useState<ProviderPlaylistRecord>();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [confirmQueueLaunch, setConfirmQueueLaunch] = useState<PlaylistRecord>();
  const [queueLaunchPendingId, setQueueLaunchPendingId] = useState('');
  const [queueLaunchErrors, setQueueLaunchErrors] = useState<Record<string, string>>({});
  const [deleteError, setDeleteError] = useState('');
  const [deletingRecordId, setDeletingRecordId] = useState('');
  const [providerRemoveError, setProviderRemoveError] = useState('');
  const [removingProviderRecordId, setRemovingProviderRecordId] = useState('');
  const [savingProviderIds, setSavingProviderIds] = useState<Set<string>>(() => new Set());
  const [providerSaveErrors, setProviderSaveErrors] = useState<Record<string, string>>({});
  const [providerSaveNameId, setProviderSaveNameId] = useState('');
  const [providerSaveNameDraft, setProviderSaveNameDraft] = useState('');
  const providerSaveNameInput = useRef<HTMLInputElement>(null);
  const [renamingProviderRecordId, setRenamingProviderRecordId] = useState('');
  const [providerNameDraft, setProviderNameDraft] = useState('');
  const [savingProviderRename, setSavingProviderRename] = useState(false);
  const [providerRenameError, setProviderRenameError] = useState('');
  const [availabilityStatuses, setAvailabilityStatuses] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [availabilityChecking, setAvailabilityChecking] = useState<Set<string>>(() => new Set());
  const providerRenameInput = useRef<HTMLInputElement>(null);
  const pendingProviderRenameFocus = useRef('');
  const [catalog, setCatalog] = useState<BrowseMedia>();
  const [ancestors, setAncestors] = useState<BrowseMedia[]>([]);
  const [target, setTarget] = useState('');
  const [targetLabel, setTargetLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [playError, setPlayError] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [browseRetry, setBrowseRetry] = useState<BrowseRequest>();
  const [playRetry, setPlayRetry] = useState<{ item: BrowseMedia; target: string }>();
  const [selectedItem, setSelectedItem] = useState<BrowseMedia>();
  const restoreFocus = useRef('');
  const focusBackAfterBrowse = useRef(false);
  const backButton = useRef<HTMLButtonElement>(null);
  const rowButtons = useRef(new Map<string, HTMLButtonElement>());
  const playlistEditButtons = useRef(new Map<string, HTMLButtonElement>());
  const providerRenameButtons = useRef(new Map<string, HTMLButtonElement>());
  const providerRemoveButtons = useRef(new Map<string, HTMLButtonElement>());
  const queueLaunchButtons = useRef(new Map<string, HTMLButtonElement>());
  const entryActionButtons = useRef(new Map<string, { up?: HTMLButtonElement; down?: HTMLButtonElement; remove?: HTMLButtonElement }>());
  const pendingEntryFocus = useRef<{ key: string; action: 'up' | 'down' | 'remove' }>();
  const pendingPlaylistFocus = useRef<string>();
  const createPlaylistButton = useRef<HTMLButtonElement>(null);
  const libraryViewButton = useRef<HTMLButtonElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const providerRemoveDialog = useRef<HTMLDialogElement>(null);
  const discardDialog = useRef<HTMLDialogElement>(null);
  const queueLaunchDialog = useRef<HTMLDialogElement>(null);
  const keepPlaylistButton = useRef<HTMLButtonElement>(null);
  const keepShortcutButton = useRef<HTMLButtonElement>(null);
  const keepEditingButton = useRef<HTMLButtonElement>(null);
  const keepCurrentQueueButton = useRef<HTMLButtonElement>(null);
  const browseMediaButton = useRef<HTMLButtonElement>(null);
  const dialogTrigger = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const closeAfterDiscard = useRef(false);
  const originalDraft = useRef<{ name: string; entries: PlaylistEntry[] }>({ name: '', entries: [] });
  const addMediaButton = useRef<HTMLButtonElement>(null);
  const request = useRef(0);
  const libraryRequest = useRef(0);
  const sessionGeneration = useRef(0);
  const draftRecordId = useRef('');
  const entryKeyCounter = useRef(0);
  const navigateAfterDiscard = useRef(false);
  const providerSaveInFlight = useRef(new Set<string>());
  const availabilityInFlight = useRef(new Set<string>());
  const playRequest = useRef(0);
  const playing = useRef(false);
  const currentHass = useRef(hass);
  currentHass.current = hass;
  const connection = hass?.connection;
  const userId = hass?.user?.id;
  const available = Boolean(connection?.connected && userId);
  const connected = Object.values(hass?.states ?? {}).filter(isConnectedTarget);
  const selected = hass?.states[target];
  const targetAvailable = available && selected !== undefined && isConnectedTarget(selected);
  const selectedQueue = queueSnapshot(selected);

  async function loadLibrary() {
    const supplied = currentHass.current;
    if (!supplied?.connection.connected || !supplied.user?.id) {
      setLibraryLoading(false);
      return;
    }
    const generation = ++libraryRequest.current;
    setLibraryLoading(true);
    setLibraryError('');
    try {
      const result = await supplied.callWS({ type: 'bl_haos/playlist_library/list' });
      if (libraryRequest.current === generation) setLibrary(result as PlaylistLibrarySnapshot);
    } catch {
      if (libraryRequest.current === generation) setLibraryError('Couldn\'t load your library. Reconnect Home Assistant, then select Retry loading.');
    } finally {
      if (libraryRequest.current === generation) setLibraryLoading(false);
    }
  }

  function availabilityLabel(key: string): string {
    if (availabilityChecking.has(key)) return 'Checking availability...';
    if (availabilityStatuses[key] === 'available') return 'Available in Home Assistant';
    if (availabilityStatuses[key] === 'unavailable') return 'Unavailable in Home Assistant.';
    return 'Not checked';
  }

  async function checkAvailability(key: string, mediaContentId: string) {
    const supplied = currentHass.current;
    if (!supplied?.connection.connected || !supplied.user?.id
      || !mediaContentId.startsWith('media-source://') || availabilityInFlight.current.has(key)) return;
    const generation = sessionGeneration.current;
    availabilityInFlight.current.add(key);
    setAvailabilityChecking((current) => new Set(current).add(key));
    setLibraryStatus('Checking availability...');
    try {
      await supplied.callWS({ type: 'media_source/browse_media', media_content_id: mediaContentId });
      if (sessionGeneration.current !== generation) return;
      setAvailabilityStatuses((current) => ({ ...current, [key]: 'available' }));
      setLibraryStatus('Available in Home Assistant.');
    } catch {
      if (sessionGeneration.current !== generation) return;
      setAvailabilityStatuses((current) => ({ ...current, [key]: 'unavailable' }));
      setLibraryStatus('Unavailable in Home Assistant.');
    } finally {
      if (sessionGeneration.current === generation) {
        availabilityInFlight.current.delete(key);
        setAvailabilityChecking((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
      }
    }
  }

  useLayoutEffect(() => {
    const supplied = currentHass.current;
    sessionGeneration.current++;
    const generation = ++request.current;
    libraryRequest.current++;
    playRequest.current++;
    playing.current = false;
    setCatalog(undefined);
    setAncestors([]);
    setView(initialViewRef.current);
    setLibrary(undefined);
    setLibraryError('');
    setLibraryStatus('');
    setCreating(false);
    setEditingRecord(undefined);
    setDraftName('');
    setDraftEntries([]);
    setDraftEntryKeys([]);
    setDraftError('');
    setSavingDraft(false);
    setDraftConflict(false);
    setPicker(false);
    setConfirmDelete(undefined);
    setConfirmProviderRemove(undefined);
    setConfirmDiscard(false);
    setConfirmQueueLaunch(undefined);
    setQueueLaunchPendingId('');
    setQueueLaunchErrors({});
    setDeleteError('');
    setDeletingRecordId('');
    setProviderRemoveError('');
    setRemovingProviderRecordId('');
    setSavingProviderIds(new Set());
    providerSaveInFlight.current.clear();
    setProviderSaveErrors({});
    setRenamingProviderRecordId('');
    setProviderNameDraft('');
    setSavingProviderRename(false);
    setProviderRenameError('');
    setAvailabilityStatuses({});
    setAvailabilityChecking(new Set());
    availabilityInFlight.current.clear();
    setProviderSaveNameId('');
    setProviderSaveNameDraft('');
    pendingProviderRenameFocus.current = '';
    draftRecordId.current = '';
    setTarget('');
    setTargetLabel('');
    setPending(false);
    setStatus('');
    setBrowseRetry(undefined);
    setPlayRetry(undefined);
    setSelectedItem(undefined);
    setQuery('');
    setSearching(false);
    setLoading(available);
    setError('');
    setPlayError('');
    if (!supplied || !available) return;
    setLoading(false);
    if (initialViewRef.current === 'browse') void browse({ path: [] }, true);
    else void loadLibrary();
    return () => {
      sessionGeneration.current++;
      request.current++;
      libraryRequest.current++;
      playRequest.current++;
    };
  }, [connection, userId, available]);

  useLayoutEffect(() => {
    if (restoreFocus.current) {
      rowButtons.current.get(restoreFocus.current)?.focus();
      restoreFocus.current = '';
    } else if (focusBackAfterBrowse.current) {
      backButton.current?.focus();
      focusBackAfterBrowse.current = false;
    }
  }, [catalog]);

  useLayoutEffect(() => {
    const pendingFocus = pendingEntryFocus.current;
    if (!pendingFocus) return;
    pendingEntryFocus.current = undefined;
    const controls = entryActionButtons.current.get(pendingFocus.key);
    if (pendingFocus.action === 'down' && controls?.down && !controls.down.disabled) controls.down.focus();
    else if (pendingFocus.action === 'up' && controls?.up && !controls.up.disabled) controls.up.focus();
    else if (controls?.remove) controls.remove.focus();
    else addMediaButton.current?.focus();
  }, [draftEntryKeys]);

  useLayoutEffect(() => {
    const activeDialog = confirmQueueLaunch ? queueLaunchDialog.current
      : confirmDelete ? deleteDialog.current
        : confirmProviderRemove ? providerRemoveDialog.current
        : confirmDiscard ? discardDialog.current : undefined;
    const dialogs = [deleteDialog.current, providerRemoveDialog.current, discardDialog.current, queueLaunchDialog.current];
    if (activeDialog && !activeDialog.open) {
      if (typeof activeDialog.showModal === 'function') activeDialog.showModal();
      else activeDialog.setAttribute('open', '');
    }
    for (const dialog of dialogs) {
      if (!dialog?.open || dialog === activeDialog) continue;
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [confirmDelete, confirmProviderRemove, confirmDiscard, confirmQueueLaunch]);

  useLayoutEffect(() => {
    if (!navigateAfterDiscard.current || confirmDiscard || creating || editingRecord) return;
    navigateAfterDiscard.current = false;
    if (dialogTrigger.current?.isConnected) dialogTrigger.current.click();
  }, [confirmDiscard, creating, editingRecord]);

  useLayoutEffect(() => {
    if (confirmQueueLaunch) keepCurrentQueueButton.current?.focus();
    else if (confirmDelete) keepPlaylistButton.current?.focus();
    else if (confirmProviderRemove) keepShortcutButton.current?.focus();
    else if (confirmDiscard) keepEditingButton.current?.focus();
    else if (dialogTrigger.current?.isConnected) dialogTrigger.current.focus();
    if (!confirmDelete && !confirmProviderRemove && !confirmDiscard && !confirmQueueLaunch) dialogTrigger.current = null;
  }, [confirmDelete, confirmProviderRemove, confirmDiscard, confirmQueueLaunch]);

  useLayoutEffect(() => {
    const recordId = pendingPlaylistFocus.current;
    if (!recordId) return;
    pendingPlaylistFocus.current = undefined;
    if (recordId === 'create') createPlaylistButton.current?.focus();
    else playlistEditButtons.current.get(recordId)?.focus();
  }, [library, creating, editingRecord, confirmDelete, confirmDiscard]);

  useLayoutEffect(() => {
    if (providerSaveNameId) providerSaveNameInput.current?.focus();
    if (renamingProviderRecordId) {
      providerRenameInput.current?.focus();
      return;
    }
    const recordId = pendingProviderRenameFocus.current;
    if (recordId) {
      pendingProviderRenameFocus.current = '';
      providerRenameButtons.current.get(recordId)?.focus();
    }
  }, [providerSaveNameId, renamingProviderRecordId, library]);

  async function browse(operation: BrowseRequest, resetSession = false) {
    const supplied = currentHass.current;
    const { item, path, query: searchQuery } = operation;
    if (!supplied?.connection.connected || !supplied.user?.id || (pending && !resetSession)
      || (item && (!item.media_content_id.startsWith('media-source://')
        || (searchQuery === undefined ? !item.can_expand : !item.can_search)))) return;
    const generation = ++request.current;
    setLoading(true);
    setError('');
    setPlayError('');
    setStatus('');
    setBrowseRetry(undefined);
    setPlayRetry(undefined);
    try {
      const result = await supplied.callWS(searchQuery !== undefined && item
        ? { type: 'media_source/search_media', media_content_id: item.media_content_id, search_query: searchQuery }
        : { type: 'media_source/browse_media', ...(item ? { media_content_id: item.media_content_id } : {}) });
      if (request.current !== generation) return;
      if (item && searchQuery === undefined) focusBackAfterBrowse.current = true;
      setAncestors(path);
      setCatalog('result' in result && item ? { ...item, children: result.result } : result as BrowseMedia);
      setSearching(searchQuery !== undefined);
      if (searchQuery === undefined) setQuery('');
    } catch {
      if (request.current === generation) {
        setError(accessError);
        setBrowseRetry(operation);
      }
    } finally {
      if (request.current === generation) setLoading(false);
    }
  }

  function openBrowse() {
    setView('browse');
    if (creating || editingRecord) setPicker(true);
    if (!catalog && !loading) void browse({ path: [] });
  }

  function startCreate() {
    draftRecordId.current = crypto.randomUUID();
    setDraftName('');
    setDraftEntries([]);
    setDraftEntryKeys([]);
    originalDraft.current = { name: '', entries: [] };
    setDraftError('');
    setDraftConflict(false);
    setEditingRecord(undefined);
    setCreating(true);
    setPicker(false);
    setView('library');
  }

  function startEditing(record: CustomPlaylistRecord) {
    setEditingRecord(record);
    setCreating(false);
    setDraftName(record.name);
    setDraftEntries(record.entries.map((entry) => ({ ...entry })));
    setDraftEntryKeys(record.entries.map(() => `entry-${entryKeyCounter.current++}`));
    originalDraft.current = { name: record.name, entries: record.entries.map((entry) => ({ ...entry })) };
    setDraftError('');
    setDraftConflict(false);
    setPicker(false);
    setView('library');
  }

  function finishEditing() {
    const focusRecordId = editingRecord?.record_id ?? (creating ? 'create' : '');
    if (focusRecordId) pendingPlaylistFocus.current = focusRecordId;
    setCreating(false);
    setEditingRecord(undefined);
    setDraftName('');
    setDraftEntries([]);
    setDraftEntryKeys([]);
    setDraftError('');
    setDraftConflict(false);
    setPicker(false);
    originalDraft.current = { name: '', entries: [] };
    draftRecordId.current = '';
    setView('library');
  }

  function isDraftDirty(): boolean {
    return draftName !== originalDraft.current.name
      || JSON.stringify(draftEntries) !== JSON.stringify(originalDraft.current.entries);
  }

  function requestEditorExit(trigger: HTMLButtonElement | HTMLAnchorElement, closingPanel = false) {
    dialogTrigger.current = trigger;
    closeAfterDiscard.current = closingPanel;
    if (isDraftDirty()) {
      setConfirmDiscard(true);
      return;
    }
    finishEditing();
  }

  function requestDelete(record: CustomPlaylistRecord, trigger: HTMLButtonElement) {
    dialogTrigger.current = trigger;
    setDeleteError('');
    setConfirmDelete(record);
  }

  function requestProviderRemove(record: ProviderPlaylistRecord, trigger: HTMLButtonElement) {
    dialogTrigger.current = trigger;
    setProviderRemoveError('');
    setConfirmProviderRemove(record);
  }

  function closeConfirmation() {
    setConfirmDelete(undefined);
    setConfirmProviderRemove(undefined);
    setConfirmDiscard(false);
    setConfirmQueueLaunch(undefined);
    setDeleteError('');
    setProviderRemoveError('');
  }

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape' && !deletingRecordId && !removingProviderRecordId && !queueLaunchPendingId) {
      event.preventDefault();
      closeConfirmation();
      return;
    }
    if (event.key !== 'Tab') return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
    if (!buttons.length) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function deletePlaylist() {
    const supplied = currentHass.current;
    const record = confirmDelete;
    if (!record || !supplied?.connection.connected || !supplied.user?.id || deletingRecordId) return;
    const generation = sessionGeneration.current;
    setDeletingRecordId(record.record_id);
    setDeleteError('');
    setLibraryStatus('Deleting playlist...');
    try {
      const result = await supplied.callWS({
        type: 'bl_haos/playlist_library/delete_custom',
        record_id: record.record_id,
        revision: library?.revision ?? 0,
      });
      if (sessionGeneration.current !== generation) return;
      const updated = result as PlaylistLibrarySnapshot;
      const customRecords = (library?.records ?? []).filter((item) => item.kind === 'custom');
      const removedIndex = customRecords.findIndex((item) => item.record_id === record.record_id);
      const remainingRecords = updated.records.filter((item) => item.kind === 'custom');
      const focusRecord = remainingRecords[Math.min(Math.max(removedIndex, 0), remainingRecords.length - 1)];
      pendingPlaylistFocus.current = focusRecord?.record_id ?? 'create';
      dialogTrigger.current = null;
      setLibrary(updated);
      setConfirmDelete(undefined);
      setLibraryStatus('Playlist deleted.');
    } catch (deleteFailure) {
      if (sessionGeneration.current !== generation) return;
      const message = deleteFailure instanceof Error ? deleteFailure.message : '';
      if (/Playlist library changed/i.test(message)) {
        setDeleteError(`Couldn't delete “${record.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
        try {
          const latest = await supplied.callWS({ type: 'bl_haos/playlist_library/list' });
          if (sessionGeneration.current === generation) setLibrary(latest as PlaylistLibrarySnapshot);
        } catch { /* Keep the last known row and confirmation context. */ }
      } else {
        setDeleteError(`Couldn't delete “${record.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
      }
      if (sessionGeneration.current === generation) setLibraryStatus('');
    } finally {
      if (sessionGeneration.current === generation) setDeletingRecordId('');
    }
  }

  function startSavingProvider(item: BrowseMedia) {
    setProviderSaveNameId(item.media_content_id);
    setProviderSaveNameDraft(item.title);
    setProviderSaveErrors((current) => {
      const next = { ...current };
      delete next[item.media_content_id];
      return next;
    });
  }

  async function saveProvider(item: BrowseMedia, requestedName: string) {
    const supplied = currentHass.current;
    const mediaContentId = item.media_content_id;
    const name = requestedName.trim();
    if (!name) {
      setProviderSaveErrors((current) => ({ ...current, [mediaContentId]: 'Enter a shortcut name before saving.' }));
      return;
    }
    if (new TextEncoder().encode(name).length > 128) {
      setProviderSaveErrors((current) => ({
        ...current,
        [mediaContentId]: 'Shortcut names must be at most 128 UTF-8 bytes. Enter a shorter name.',
      }));
      return;
    }
    if (!supplied?.connection.connected || !supplied.user?.id || !isProviderPlaylist(item)
      || savingProviderIds.has(mediaContentId) || providerSaveInFlight.current.has(mediaContentId)
      || !mediaContentId.startsWith('media-source://')) return;
    const generation = sessionGeneration.current;
    providerSaveInFlight.current.add(mediaContentId);
    setSavingProviderIds((current) => new Set(current).add(mediaContentId));
    setProviderSaveErrors((current) => {
      const next = { ...current };
      delete next[mediaContentId];
      return next;
    });
    setLibraryStatus(`Saving “${name}” to your library...`);
    try {
      const result = await supplied.callWS({
        type: 'bl_haos/playlist_library/save_provider',
        media_content_id: mediaContentId,
        name,
        ...(item.title ? { title: item.title } : {}),
        ...(item.media_class ? { media_class: item.media_class } : {}),
        ...(item.media_content_type ? { media_content_type: item.media_content_type } : {}),
      });
      if (sessionGeneration.current !== generation) return;
      setLibrary(result as PlaylistLibrarySnapshot);
      setProviderSaveNameId('');
      setProviderSaveNameDraft('');
      setLibraryStatus('Playlist saved to your library.');
    } catch {
      if (sessionGeneration.current === generation) {
        setProviderSaveErrors((current) => ({
          ...current,
          [mediaContentId]: `Couldn't save “${name}” to your library right now. Nothing was added. Select Save shortcut to try again, or cancel to return to Browse media.`,
        }));
        setLibraryStatus('');
      }
    } finally {
      if (sessionGeneration.current === generation) {
        providerSaveInFlight.current.delete(mediaContentId);
        setSavingProviderIds((current) => {
          const next = new Set(current);
          next.delete(mediaContentId);
          return next;
        });
      }
    }
  }

  function startRenamingProvider(record: ProviderPlaylistRecord) {
    setRenamingProviderRecordId(record.record_id);
    setProviderNameDraft(record.name);
    setProviderRenameError('');
  }

  function cancelProviderRename(recordId: string) {
    pendingProviderRenameFocus.current = recordId;
    setRenamingProviderRecordId('');
    setProviderNameDraft('');
    setProviderRenameError('');
  }

  async function saveProviderName(record: ProviderPlaylistRecord) {
    const supplied = currentHass.current;
    const name = providerNameDraft.trim();
    if (!name) {
      setProviderRenameError('Enter a shortcut name before saving.');
      return;
    }
    if (!supplied?.connection.connected || !supplied.user?.id || savingProviderRename) return;
    const generation = sessionGeneration.current;
    setSavingProviderRename(true);
    setProviderRenameError('');
    setLibraryStatus('Saving shortcut name...');
    try {
      const result = await supplied.callWS({
        type: 'bl_haos/playlist_library/rename_provider',
        record_id: record.record_id,
        name,
        revision: library?.revision ?? 0,
      });
      if (sessionGeneration.current !== generation) return;
      setLibrary(result as PlaylistLibrarySnapshot);
      pendingProviderRenameFocus.current = record.record_id;
      setRenamingProviderRecordId('');
      setProviderNameDraft('');
      setLibraryStatus('Shortcut name saved.');
    } catch (renameError) {
      if (sessionGeneration.current !== generation) return;
      setProviderRenameError(renameError instanceof Error && /invalid_format|Invalid playlist record/i.test(renameError.message)
        ? 'Shortcut names must be non-empty and at most 128 UTF-8 bytes. Enter a shorter name, then save again.'
        : `Couldn't rename “${record.name}” right now. Your local name is still here. Select Save shortcut name to try again.`);
      providerRenameInput.current?.focus();
      if (renameError instanceof Error && /Playlist library changed/i.test(renameError.message)) {
        try {
          const latest = await supplied.callWS({ type: 'bl_haos/playlist_library/list' });
          if (sessionGeneration.current === generation) setLibrary(latest as PlaylistLibrarySnapshot);
        } catch { /* Keep the last known shortcut and the local draft. */ }
      }
      if (sessionGeneration.current === generation) setLibraryStatus('');
    } finally {
      if (sessionGeneration.current === generation) setSavingProviderRename(false);
    }
  }

  async function removeProviderShortcut() {
    const supplied = currentHass.current;
    const record = confirmProviderRemove;
    if (!record || !supplied?.connection.connected || !supplied.user?.id || removingProviderRecordId) return;
    const generation = sessionGeneration.current;
    setRemovingProviderRecordId(record.record_id);
    setProviderRemoveError('');
    setLibraryStatus('Removing shortcut...');
    try {
      const result = await supplied.callWS({
        type: 'bl_haos/playlist_library/delete_provider',
        record_id: record.record_id,
        revision: library?.revision ?? 0,
      });
      if (sessionGeneration.current !== generation) return;
      setLibrary(result as PlaylistLibrarySnapshot);
      dialogTrigger.current = browseMediaButton.current;
      setConfirmProviderRemove(undefined);
      setLibraryStatus('Shortcut removed. The Home Assistant playlist is unchanged.');
    } catch (removeError) {
      if (sessionGeneration.current !== generation) return;
      setProviderRemoveError(`Couldn't remove “${record.name}” right now. The shortcut remains in your library, and the Home Assistant playlist is unchanged. Select Remove shortcut to try again, or Keep shortcut.`);
      if (removeError instanceof Error && /Playlist library changed/i.test(removeError.message)) {
        try {
          const latest = await supplied.callWS({ type: 'bl_haos/playlist_library/list' });
          if (sessionGeneration.current === generation) setLibrary(latest as PlaylistLibrarySnapshot);
        } catch { /* Keep the last known shortcut and confirmation context. */ }
      }
      if (sessionGeneration.current === generation) setLibraryStatus('');
    } finally {
      if (sessionGeneration.current === generation) setRemovingProviderRecordId('');
    }
  }

  function addMedia(item: BrowseMedia) {
    if (!item.can_play || !item.media_content_id.startsWith('media-source://')) return;
    const mediaClass = item.media_class?.toLowerCase();
    const isAudio = item.media_content_type.toLowerCase().startsWith('audio/')
      || ['music', 'track', 'episode'].includes(mediaClass ?? '');
    if (!isAudio) return;
    const entry: PlaylistEntry = {
      media_content_id: item.media_content_id,
      title: item.title,
      ...(item.media_class ? { media_class: item.media_class } : {}),
      media_content_type: item.media_content_type,
    };
    setDraftEntries((current) => [...current, entry]);
    setDraftEntryKeys((current) => [...current, `entry-${entryKeyCounter.current++}`]);
    setDraftError('');
    setPicker(false);
    setView('library');
  }

  function moveEntry(index: number, offset: -1 | 1) {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= draftEntries.length) return;
    const nextEntries = [...draftEntries];
    const nextKeys = [...draftEntryKeys];
    [nextEntries[index], nextEntries[nextIndex]] = [nextEntries[nextIndex], nextEntries[index]];
    [nextKeys[index], nextKeys[nextIndex]] = [nextKeys[nextIndex], nextKeys[index]];
    pendingEntryFocus.current = { key: draftEntryKeys[index], action: offset === 1 ? 'down' : 'up' };
    setDraftEntries(nextEntries);
    setDraftEntryKeys(nextKeys);
    setDraftError('');
    const title = draftEntries[index].title || 'Media item';
    setLibraryStatus(`Moved ${title} to position ${nextIndex + 1} of ${draftEntries.length}.`);
  }

  function removeDraftEntry(index: number) {
    const nextEntries = draftEntries.filter((_, entryIndex) => entryIndex !== index);
    const nextKeys = draftEntryKeys.filter((_, entryIndex) => entryIndex !== index);
    const focusIndex = Math.min(index, nextKeys.length - 1);
    pendingEntryFocus.current = focusIndex >= 0
      ? { key: nextKeys[focusIndex], action: 'remove' }
      : { key: '', action: 'remove' };
    setDraftEntries(nextEntries);
    setDraftEntryKeys(nextKeys);
    setDraftError('');
  }

  async function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supplied = currentHass.current;
    const name = draftName.trim();
    if (!name) {
      setDraftError('Enter a playlist name before saving.');
      return;
    }
    if (!supplied?.connection.connected || !supplied.user?.id || savingDraft) return;
    const generation = sessionGeneration.current;
    if (creating) draftRecordId.current ||= crypto.randomUUID();
    setSavingDraft(true);
    setDraftError('');
    setLibraryStatus(creating ? 'Saving playlist...' : 'Saving changes...');
    try {
      const result = await supplied.callWS({
        type: creating ? 'bl_haos/playlist_library/save_custom' : 'bl_haos/playlist_library/update_custom',
        record_id: creating ? draftRecordId.current : editingRecord!.record_id,
        name,
        entries: draftEntries,
        revision: library?.revision ?? 0,
      });
      if (sessionGeneration.current !== generation) return;
      setLibrary(result as PlaylistLibrarySnapshot);
      finishEditing();
      setLibraryStatus(creating ? 'Playlist saved.' : 'Changes saved.');
    } catch (saveError) {
      if (sessionGeneration.current !== generation) return;
      const message = saveError instanceof Error ? saveError.message : '';
      if (/Playlist library changed/i.test(message)) {
        setDraftConflict(true);
        setDraftError('This playlist changed in Home Assistant. Your edits are still here. The newer saved version was kept; stop editing and reopen the playlist to review it.');
        try {
          const latest = await supplied.callWS({ type: 'bl_haos/playlist_library/list' });
          if (sessionGeneration.current === generation) setLibrary(latest as PlaylistLibrarySnapshot);
        } catch { /* Keep the last known library and the current draft. */ }
      } else if (/not found/i.test(message)) {
        setDraftError('The selected playlist or a media item couldn\'t be matched. Return to Your playlists and select Edit playlist on the intended row; for an affected media item, remove it or add it again from Browse media. Your valid draft data is still here.');
      } else if (/invalid_format|Invalid playlist record/i.test(message)) {
        setDraftError('This playlist has details that can\'t be saved yet. Review the playlist name and entries, correct any marked fields, then select Save playlist or Save changes. Your valid draft data is still here.');
      } else if (creating) {
        setDraftError('Couldn\'t save this playlist right now. Your draft is still here. Select Save playlist to try again, or Discard draft to leave without saving.');
      } else {
        setDraftError(`Couldn't save changes to “${editingRecord?.name ?? name}” right now. Your edits are still here. Select Save changes to try again, or Stop editing to leave without saving.`);
      }
      if (sessionGeneration.current === generation) setLibraryStatus('');
    } finally {
      if (sessionGeneration.current === generation) setSavingDraft(false);
    }
  }

  function back(index = ancestors.length - 1) {
    const ancestor = ancestors[index];
    if (!ancestor || pending) return;
    request.current++;
    restoreFocus.current = catalog?.media_content_id ?? '';
    setCatalog(ancestor);
    setAncestors(ancestors.slice(0, index));
    setLoading(false);
    setSearching(false);
    setQuery('');
    setBrowseRetry(undefined);
    setError('');
    setPlayError('');
  }

  function requestQueueLaunch(record: PlaylistRecord, trigger: HTMLButtonElement) {
    if (!available || !targetAvailable || libraryLoading || pending || queueLaunchPendingId
      || (record.kind === 'custom' && record.entries.length === 0)) return;
    setQueueLaunchErrors((current) => {
      const next = { ...current };
      delete next[record.record_id];
      return next;
    });
    if (hasActiveQueue(selectedQueue)) {
      dialogTrigger.current = trigger;
      setConfirmQueueLaunch(record);
      return;
    }
    void startSavedPlaylist(record);
  }

  async function startSavedPlaylist(record: PlaylistRecord) {
    const supplied = currentHass.current;
    const entityId = target;
    const speaker = supplied?.states[entityId];
    if (!supplied?.connection.connected || !supplied.user?.id || !speaker || !isConnectedTarget(speaker)
      || !entityId || queueLaunchPendingId) return;
    const generation = sessionGeneration.current;
    setQueueLaunchPendingId(record.record_id);
    setLibraryStatus(`Preparing “${record.name}” for ${entityName(speaker)}…`);
    try {
      await supplied.callWS({
        type: 'bl_haos/playlist_library/start',
        record_id: record.record_id,
        entity_id: entityId,
      });
      if (sessionGeneration.current !== generation) return;
      const currentSpeaker = currentHass.current?.states[entityId];
      if (!currentSpeaker || !isConnectedTarget(currentSpeaker)) {
        setQueueLaunchErrors((current) => ({
          ...current,
          [record.record_id]: `Couldn't confirm “${record.name}” started on ${entityName(speaker)}. Check the current queue before trying again.`,
        }));
        setLibraryStatus('');
        return;
      }
      setLibraryStatus(`Queue updated on ${entityName(currentSpeaker)}.`);
      setConfirmQueueLaunch(undefined);
    } catch {
      if (sessionGeneration.current === generation) {
        setQueueLaunchErrors((current) => ({
          ...current,
          [record.record_id]: `Couldn't confirm “${record.name}” started on ${entityName(speaker)}. Check the current queue before trying again.`,
        }));
        setLibraryStatus('');
      }
    } finally {
      if (sessionGeneration.current === generation) setQueueLaunchPendingId('');
    }
  }

  async function play(item: BrowseMedia, entityId = target) {
    const supplied = currentHass.current;
    const speaker = supplied?.states[entityId];
    if (!supplied?.connection.connected || !supplied.user?.id || !speaker || !isConnectedTarget(speaker) || !item.can_play
      || entityId !== target || loading || !item.media_content_id.startsWith('media-source://') || playing.current) return;
    const generation = ++playRequest.current;
    playing.current = true;
    setPending(true);
    setPlayError('');
    setStatus('');
    setSelectedItem(item);
    setPlayRetry(undefined);
    try {
      await supplied.callService('media_player', 'play_media', {
        media_content_id: item.media_content_id,
        media_content_type: item.media_content_type,
      }, { entity_id: speaker.entity_id });
      if (playRequest.current !== generation) return;
      const currentSpeaker = currentHass.current?.states[speaker.entity_id];
      if (currentSpeaker && isConnectedTarget(currentSpeaker)) {
        setStatus(`Starting playback on ${entityName(currentSpeaker)}`);
      } else {
        setPlayError('The selected speaker is unavailable. Select a connected speaker to play media.');
      }
    } catch {
      if (playRequest.current === generation) {
        setPlayError(`Home Assistant could not play this item on ${entityName(speaker)}. Check the provider access and speaker connection, then try again.`);
        setPlayRetry({ item, target: speaker.entity_id });
      }
    } finally {
      if (playRequest.current === generation) {
        playing.current = false;
        setPending(false);
      }
    }
  }

  return <main className="neu-page" onKeyDown={(event) => {
    if (view === 'browse' && event.key === 'Escape' && ancestors.length && !pending) { event.preventDefault(); back(); }
  }}>
    <header className="catalog-header">
      <div className="catalog-heading">
        {view === 'browse' && <button className="neu-button icon-button" aria-label="Back" title="Back"
          ref={backButton} disabled={ancestors.length === 0 || pending} onClick={() => back()}><ArrowLeft size={20} aria-hidden="true" /></button>}
        <div><p className="eyebrow">BL-HAOS</p><h1>{view === 'library' ? 'Media Library' : 'Media Catalog'}</h1></div>
      </div>
      <div className="target-control"><label htmlFor="catalog-target">Play on</label>
        <select id="catalog-target" className="neu-inset" value={target} disabled={!available || pending || Boolean(queueLaunchPendingId)}
          onChange={(event) => {
            setTarget(event.target.value);
            const speaker = hass?.states[event.target.value];
            setTargetLabel(speaker ? entityName(speaker) : '');
            setStatus('');
            setLibraryStatus('');
            setPlayRetry(undefined);
            setPlayError('');
            setQueueLaunchErrors({});
          }}>
          <option value="">Select a connected speaker</option>
          {target && !targetAvailable && <option value={target} disabled>{targetLabel} (unavailable)</option>}
          {connected.map((speaker) => <option key={speaker.entity_id} value={speaker.entity_id}>{entityName(speaker)}</option>)}
        </select>
        {target && <span className="selected-target" title={targetAvailable && selected ? entityName(selected) : targetLabel}>
          {targetAvailable && selected ? entityName(selected) : targetLabel}</span>}
      </div>
      <a className="neu-button icon-button close-catalog" href="/" aria-label="Close catalog" title="Close catalog"
        onClick={(event) => {
          if (creating || editingRecord) {
            if (isDraftDirty()) {
              event.preventDefault();
              requestEditorExit(event.currentTarget, true);
            } else {
              finishEditing();
            }
          }
        }}><X size={20} aria-hidden="true" /></a>
    </header>
    <nav className="view-toggle" aria-label="Media views">
      <button className="neu-button" type="button" ref={libraryViewButton} aria-pressed={panelTab === 'media' && view === 'library'} onClick={() => {
        setPanelTab('media');
        setPicker(false);
        setView('library');
        if (!library && !libraryLoading && !libraryError) void loadLibrary();
      }}>Library</button>
      <button className="neu-button" type="button" ref={browseMediaButton} aria-pressed={panelTab === 'media' && view === 'browse'} onClick={() => { setPanelTab('media'); openBrowse(); }}>Browse media</button>
      <button className="neu-button" type="button" aria-pressed={panelTab === 'speakers'} onClick={() => setPanelTab('speakers')}>Speakers</button>
    </nav>
    {panelTab === 'speakers' ? <SpeakerManagement hass={hass} /> : view === 'library' ? <>
      {!available && <p role="alert">Your Home Assistant session is unavailable.</p>}
      {libraryError && <div className="error" role="alert"><p>{libraryError}</p>
        <button className="neu-button" disabled={!available || libraryLoading} onClick={() => void loadLibrary()}>Retry loading</button>
      </div>}
      <p className="status" role="status" aria-live="polite" aria-atomic="true">{libraryLoading ? 'Loading playlists...' : libraryStatus}</p>
      <section className="neu-surface queue-summary" aria-label="Playback queue">
        <h2>Playback queue</h2>
        <div className="queue-summary-body" aria-live="polite" aria-atomic="true">
          {!target && <p>No active queue. Select a connected speaker to view playback.</p>}
          {target && !targetAvailable && <p>Speaker disconnected. The queue was stopped. Select a connected speaker to start a playlist.</p>}
          {targetAvailable && !selectedQueue && <p>No active queue</p>}
          {targetAvailable && selectedQueue && <>
            <p className="queue-playlist">{selectedQueue.status === 'completed' ? 'Playlist complete' : selectedQueue.playlist ?? 'Playback queue'}</p>
            <p>{selectedQueue.title ?? 'Current item unavailable'}</p>
            {selectedQueue.artist && <p className="metadata">{selectedQueue.artist}</p>}
            {typeof selectedQueue.index === 'number' && typeof selectedQueue.count === 'number'
              && <p>Item {selectedQueue.index} of {selectedQueue.count}</p>}
            <p>{formatTime(selectedQueue.position)} / {formatTime(selectedQueue.duration)}</p>
            <p className="metadata">{selectedQueue.status ?? 'Status unavailable'}{selectedQueue.shuffle ? ' · Shuffle on' : ''}{selectedQueue.repeat ? ` · Repeat ${selectedQueue.repeat}` : ''}</p>
            {selectedQueue.error && <p className="error" role="alert">Playback failed. Nothing was skipped.</p>}
          </>}
        </div>
      </section>
      {connected.length === 0 && <p className="warning">No connected speakers are available. Connect a speaker, then select it to play a playlist.</p>}
      <section className="neu-surface" aria-label="Your playlists" aria-busy={libraryLoading}>
        <h2>Your playlists</h2>
        <div className="library-body">
          {libraryLoading && <p className="library-message">Loading playlists...</p>}
          {!libraryLoading && !libraryError && library && !library.records.some((record) => record.kind === 'custom')
            && !library.records.some(isProviderRecord) && <div className="empty-state"><h3>Your library is empty</h3>
              <p>Create a playlist or browse Home Assistant media to save a playlist reference.</p></div>}
          {!libraryLoading && <ul aria-label="Your playlists">
            {(library?.records ?? []).filter(isCustomRecord).map((record) => <li key={record.record_id}>
              <Music2 className="media-icon" size={24} aria-hidden="true" />
              <div className="media-detail"><span className="media-title">{record.name}</span><span className="metadata">{record.entries.length} items</span>
                {queueLaunchErrors[record.record_id] && <span className="error" role="alert">{queueLaunchErrors[record.record_id]}</span>}
              </div>
              <div className="row-actions">
                <button className="neu-button primary-button" type="button" aria-label={`Play playlist ${record.name}`}
                  ref={(button) => {
                    if (button) queueLaunchButtons.current.set(record.record_id, button);
                    else queueLaunchButtons.current.delete(record.record_id);
                  }} disabled={!available || !targetAvailable || record.entries.length === 0 || libraryLoading || Boolean(queueLaunchPendingId)}
                  onClick={(event) => requestQueueLaunch(record, event.currentTarget)}>
                  {queueLaunchPendingId === record.record_id ? 'Preparing...' : 'Play playlist'}
                </button>
                <button className="neu-button" type="button" ref={(button) => {
                  if (button) playlistEditButtons.current.set(record.record_id, button);
                  else playlistEditButtons.current.delete(record.record_id);
                }} disabled={!available || Boolean(deletingRecordId) || creating || Boolean(editingRecord)} onClick={() => startEditing(record)}>Edit playlist</button>
                <button className="neu-button destructive-button" type="button" disabled={!available || Boolean(deletingRecordId) || creating || Boolean(editingRecord)}
                  onClick={(event) => requestDelete(record, event.currentTarget)}>Delete playlist</button>
              </div>
            </li>)}
          </ul>}
          {!creating && !editingRecord && <button className="neu-button primary-button" type="button" disabled={!available || !library || Boolean(libraryError) || libraryLoading || savingDraft}
            ref={createPlaylistButton} onClick={startCreate}>Create playlist</button>}
          {(creating || editingRecord) && !picker && <form className="playlist-form" onSubmit={(event) => void saveDraft(event)}>
            <label htmlFor="playlist-name">Playlist name</label>
            <input id="playlist-name" className="neu-inset" type="text" value={draftName}
              onChange={(event) => { setDraftName(event.target.value); setDraftError(''); }} disabled={savingDraft} />
            <h3>Playlist entries</h3>
            <ol className="playlist-entries" aria-label="Playlist entries" aria-busy={savingDraft}>
              {draftEntries.length === 0 && <li className="empty-entry">No media added yet. Add media to build this playlist, or save it as an empty draft.</li>}
              {draftEntries.map((entry, index) => {
                const entryKey = draftEntryKeys[index];
                const title = entry.title || 'Media item';
                const setEntryActionRef = (action: 'up' | 'down' | 'remove', button: HTMLButtonElement | null) => {
                  const controls = entryActionButtons.current.get(entryKey) ?? {};
                  if (button) controls[action] = button;
                  else delete controls[action];
                  entryActionButtons.current.set(entryKey, controls);
                };
                return <li key={entryKey}>
                  <Music2 className="media-icon" size={24} aria-hidden="true" />
                  <div className="media-detail"><span className="media-title" title={title}>{title}</span>
                    <span className="metadata">{entry.media_class ?? entry.media_content_type ?? 'Home Assistant media'}</span>
                    <span className="metadata">
                      {availabilityLabel(`entry:${entryKey}`)}
                    </span>
                  </div>
                  <div className="row-actions entry-actions">
                    <button className="neu-button" type="button"
                      disabled={!available || availabilityChecking.has(`entry:${entryKey}`)}
                      onClick={() => void checkAvailability(`entry:${entryKey}`, entry.media_content_id)}>
                      {availabilityChecking.has(`entry:${entryKey}`) ? 'Checking availability...' : 'Check availability'}
                    </button>
                    <button className="neu-button icon-button" type="button" aria-label="Move entry up" title="Move entry up"
                      ref={(button) => setEntryActionRef('up', button)} disabled={savingDraft || index === 0} onClick={() => moveEntry(index, -1)}>
                      <ArrowUp size={18} aria-hidden="true" />
                    </button>
                    <button className="neu-button icon-button" type="button" aria-label="Move entry down" title="Move entry down"
                      ref={(button) => setEntryActionRef('down', button)} disabled={savingDraft || index === draftEntries.length - 1} onClick={() => moveEntry(index, 1)}>
                      <ArrowDown size={18} aria-hidden="true" />
                    </button>
                    <button className="neu-button" type="button" aria-label={`Remove ${title}`} disabled={savingDraft} ref={(button) => setEntryActionRef('remove', button)}
                      onClick={() => removeDraftEntry(index)}>Remove media item</button>
                  </div>
                </li>;
              })}
            </ol>
            <div className="row-actions editor-actions">
              <button className="neu-button" type="button" ref={addMediaButton} disabled={!available || savingDraft} onClick={() => { setPicker(true); setView('browse'); if (!catalog && !loading) void browse({ path: [] }); }}>Add media</button>
              <button className="neu-button" type="submit" disabled={!available || savingDraft || draftConflict}>{savingDraft ? 'Saving...' : creating ? 'Save playlist' : 'Save changes'}</button>
              <button className="neu-button" type="button" disabled={savingDraft} onClick={(event) => requestEditorExit(event.currentTarget)}>{creating ? 'Discard draft' : 'Stop editing'}</button>
            </div>
            {draftError && <p className="error" role="alert">{draftError}</p>}
          </form>}
        </div>
      </section>
      <section className="neu-surface provider-library" aria-label="Saved Home Assistant playlists" aria-busy={libraryLoading}>
        <h2>Saved Home Assistant playlists</h2>
        <div className="provider-library-body">
          {libraryLoading && <p className="library-message">Loading saved playlists...</p>}
          {!libraryLoading && !libraryError && library && !library.records.some(isProviderRecord)
            && <div className="empty-state"><p>No Home Assistant playlists saved. Browse media to save a playlist reference.</p>
              <button className="neu-button" type="button" disabled={!available} onClick={openBrowse}>Browse media</button></div>}
          {!libraryLoading && <ul aria-label="Saved Home Assistant playlists">
            {(library?.records ?? []).filter(isProviderRecord).map((record) => <li key={record.record_id}>
              <Music2 className="media-icon" size={24} aria-hidden="true" />
              <div className="media-detail">
                <span className="media-title provider-title" title={record.name}>{record.name}</span>
                <span className="metadata">Home Assistant playlist</span>
                <span className="metadata">Provider contents are managed by Home Assistant.</span>
                <span className="metadata">
                  {availabilityLabel(`provider:${record.record_id}`)}
                </span>
                {queueLaunchErrors[record.record_id] && <span className="error" role="alert">{queueLaunchErrors[record.record_id]}</span>}
                {renamingProviderRecordId === record.record_id
                  ? <form className="provider-rename-form" onSubmit={(event) => { event.preventDefault(); void saveProviderName(record); }}>
                    <label htmlFor={`shortcut-name-${record.record_id}`}>Shortcut name</label>
                    <input id={`shortcut-name-${record.record_id}`} ref={providerRenameInput} className="neu-inset" value={providerNameDraft}
                      onChange={(event) => { setProviderNameDraft(event.target.value); setProviderRenameError(''); }} disabled={savingProviderRename} />
                    <div className="row-actions">
                      <button className="neu-button" type="submit" disabled={!available || savingProviderRename}>
                        {savingProviderRename ? 'Saving...' : 'Save shortcut name'}
                      </button>
                      <button className="neu-button" type="button" disabled={savingProviderRename}
                        onClick={() => cancelProviderRename(record.record_id)}>Cancel rename</button>
                    </div>
                    {providerRenameError && <p className="error" role="alert">{providerRenameError}</p>}
                  </form>
                  : <div className="row-actions provider-actions">
                    <button className="neu-button primary-button" type="button" aria-label={`Play playlist ${record.name}`}
                      ref={(button) => {
                        if (button) queueLaunchButtons.current.set(record.record_id, button);
                        else queueLaunchButtons.current.delete(record.record_id);
                      }} disabled={!available || !targetAvailable || Boolean(queueLaunchPendingId)}
                      onClick={(event) => requestQueueLaunch(record, event.currentTarget)}>
                      {queueLaunchPendingId === record.record_id ? 'Preparing...' : 'Play playlist'}
                    </button>
                    <button className="neu-button" type="button"
                      disabled={!available || availabilityChecking.has(`provider:${record.record_id}`)}
                      onClick={() => void checkAvailability(`provider:${record.record_id}`, record.media_content_id)}>
                      {availabilityChecking.has(`provider:${record.record_id}`) ? 'Checking availability...' : 'Check availability'}
                    </button>
                    <button className="neu-button" type="button" ref={(button) => {
                      if (button) providerRenameButtons.current.set(record.record_id, button);
                      else providerRenameButtons.current.delete(record.record_id);
                    }} disabled={!available || Boolean(removingProviderRecordId) || Boolean(renamingProviderRecordId)}
                      onClick={() => startRenamingProvider(record)}>Rename shortcut</button>
                    <button className="neu-button destructive-button" type="button" ref={(button) => {
                      if (button) providerRemoveButtons.current.set(record.record_id, button);
                      else providerRemoveButtons.current.delete(record.record_id);
                    }} disabled={!available || Boolean(removingProviderRecordId) || Boolean(renamingProviderRecordId)}
                      onClick={(event) => requestProviderRemove(record, event.currentTarget)}>Remove shortcut</button>
                  </div>}
              </div>
            </li>)}
          </ul>}
        </div>
      </section>
    </> : <>
    {!picker && target && !targetAvailable && <p className="warning">{targetLabel} is unavailable. Select a connected speaker to play media.</p>}
    {!available && <p role="alert">Your Home Assistant session is unavailable.</p>}
    {error && <div className="error" role="alert"><p>{error}</p>
      {browseRetry && <button className="neu-button" disabled={!available || loading || pending}
        onClick={() => void browse(browseRetry)}>{browseRetry.query !== undefined ? 'Retry search' : browseRetry.item ? `Retry opening ${browseRetry.item.title}` : 'Retry media sources'}</button>}
    </div>}
    {playError && <div className="error" role="alert"><p>{playError}</p>
      {playRetry && playRetry.target === target && <button className="neu-button" disabled={!targetAvailable || loading || pending}
        onClick={() => void play(playRetry.item, playRetry.target)}>Retry {playRetry.item.title} on {targetLabel}</button>}
    </div>}
    <p className="status" role="status" aria-live="polite" aria-atomic="true">{loading ? 'Loading media sources...' : libraryStatus || status}</p>
    <nav className="catalog-path" aria-label="Catalog path">
      {ancestors.map((ancestor, index) => <button className="neu-button" key={`${ancestor.media_content_id}-${index}`}
        disabled={pending} onClick={() => back(index)} title={ancestor.title}>{ancestor.title}</button>)}
      <span aria-current="page" title={catalog?.title}>{catalog?.title ?? 'Media sources'}</span>
    </nav>
    <section className="neu-surface" aria-label={catalog?.title ?? 'Media sources'} aria-busy={loading}>
      <h2>{catalog?.title ?? 'Media sources'}</h2>
      {catalog?.can_search && <form className="catalog-search" role="search" onSubmit={(event) => {
        event.preventDefault();
        if (query.trim() && !loading) void browse({ item: catalog, path: ancestors, query: query.trim() });
      }}>
        <label className="search-control">Search media<input className="neu-inset" type="search" value={query}
          onChange={(event) => setQuery(event.target.value)} disabled={!available || loading || pending} /></label>
        <button className="neu-button icon-button" type="submit" aria-label="Search" title="Search" disabled={!query.trim() || !available || loading || pending}><Search size={20} aria-hidden="true" /></button>
        {searching && <button className="neu-button" type="button" disabled={loading || pending}
          onClick={() => void browse({ item: catalog, path: ancestors })}>Clear search</button>}
      </form>}
      <div className="catalog-body">
        {catalog && !loading && !catalog.children?.length && (picker
          ? <div className="empty-state"><p>No playable audio media are available in this Home Assistant source.</p></div>
          : <div className="empty-state"><h3>No audio sources are available</h3>
            <p>Home Assistant did not return a playable audio source. Check the media provider and try again.</p></div>)}
        <ul aria-label="Catalog items">
          {(catalog?.children ?? []).map((item) => <li key={item.media_content_id} aria-current={selectedItem?.media_content_id === item.media_content_id ? 'true' : undefined}>
            <MediaThumbnail hass={hass} thumbnail={item.thumbnail} />
            <div className="media-detail"><span className="media-title" title={item.title}>{item.title}</span>
              <span className="metadata" title={item.media_content_type}>{item.media_class ?? item.media_content_type}</span>
              {!item.can_play && !item.can_expand && <span className="metadata">{unsupported}</span>}</div>
            <div className="row-actions">
              {item.can_expand && <button className="neu-button icon-button" aria-label={`Open ${item.title}`} title={`Open ${item.title}`}
                ref={(button) => { if (button) rowButtons.current.set(item.media_content_id, button); else rowButtons.current.delete(item.media_content_id); }}
                disabled={loading || pending || !available || !item.media_content_id.startsWith('media-source://')}
                onClick={() => void browse({ item, path: catalog ? [...ancestors, catalog] : [] })}><ChevronRight size={20} aria-hidden="true" /></button>}
              {picker && item.can_play && (item.media_content_type.toLowerCase().startsWith('audio/')
                || ['music', 'track', 'episode'].includes(item.media_class?.toLowerCase() ?? ''))
                && <button className="neu-button" aria-label={`Add media ${item.title}`} disabled={loading || pending || !available}
                  onClick={() => addMedia(item)}>Add media</button>}
              {!picker && isProviderPlaylist(item) && (providerSaveNameId === item.media_content_id
                ? <form className="provider-rename-form" onSubmit={(event) => { event.preventDefault(); void saveProvider(item, providerSaveNameDraft); }}>
                  <label htmlFor={`provider-save-name-${item.media_content_id}`}>Shortcut name</label>
                  <input id={`provider-save-name-${item.media_content_id}`} ref={providerSaveNameInput} className="neu-inset"
                    value={providerSaveNameDraft} onChange={(event) => {
                      setProviderSaveNameDraft(event.target.value);
                      setProviderSaveErrors((current) => { const next = { ...current }; delete next[item.media_content_id]; return next; });
                    }} disabled={savingProviderIds.has(item.media_content_id)} />
                  <div className="row-actions">
                    <button className="neu-button" type="submit" disabled={!available || savingProviderIds.has(item.media_content_id)}>
                      {savingProviderIds.has(item.media_content_id) ? 'Saving...' : 'Save shortcut'}
                    </button>
                    <button className="neu-button" type="button" disabled={savingProviderIds.has(item.media_content_id)} onClick={() => {
                      setProviderSaveNameId('');
                      setProviderSaveNameDraft('');
                      setProviderSaveErrors((current) => { const next = { ...current }; delete next[item.media_content_id]; return next; });
                    }}>Cancel</button>
                  </div>
                </form>
                : <button className="neu-button" type="button"
                  aria-label={`Save to library ${item.title}`}
                  disabled={!available || loading || pending || savingProviderIds.has(item.media_content_id)
                    || Boolean(library?.records.some((record) => record.kind === 'provider' && record.media_content_id === item.media_content_id))}
                  onClick={() => startSavingProvider(item)}>
                  {savingProviderIds.has(item.media_content_id) ? 'Saving...'
                    : library?.records.some((record) => record.kind === 'provider' && record.media_content_id === item.media_content_id)
                      ? 'Saved to library' : 'Save to library'}
                </button>)}
              {providerSaveErrors[item.media_content_id] && <p className="error" role="alert">{providerSaveErrors[item.media_content_id]}</p>}
              {!picker && item.can_play && <button className="neu-button" aria-label={`Play ${item.title}`}
                disabled={!targetAvailable || loading || pending || !item.media_content_id.startsWith('media-source://')}
                onClick={() => void play(item)}><Play size={18} aria-hidden="true" />Play</button>}
            </div>
          </li>)}
        </ul>
      </div>
    </section>
    </>}
    {confirmDelete && <dialog ref={deleteDialog} aria-modal="true" aria-labelledby="delete-playlist-heading" className="confirmation-dialog"
      onKeyDown={handleDialogKeyDown} onCancel={(event) => { event.preventDefault(); if (!deletingRecordId) closeConfirmation(); }}>
      <h2 id="delete-playlist-heading">Delete playlist: {confirmDelete.name}</h2>
      <p>Delete “{confirmDelete.name}” from your BL-HAOS library? Its saved entries will be removed. This cannot be undone.</p>
      {deleteError && <p className="error" role="alert">{deleteError}</p>}
      <div className="row-actions">
        <button className="neu-button" type="button" ref={keepPlaylistButton} disabled={Boolean(deletingRecordId)} onClick={closeConfirmation}>Keep playlist</button>
        <button className="neu-button destructive-button" type="button" disabled={Boolean(deletingRecordId)} onClick={() => void deletePlaylist()}>
          {deletingRecordId ? 'Deleting playlist...' : 'Delete playlist'}
        </button>
      </div>
    </dialog>}
    {confirmProviderRemove && <dialog ref={providerRemoveDialog} aria-modal="true" aria-labelledby="remove-shortcut-heading" className="confirmation-dialog"
      onKeyDown={handleDialogKeyDown} onCancel={(event) => { event.preventDefault(); if (!removingProviderRecordId) closeConfirmation(); }}>
      <h2 id="remove-shortcut-heading">Remove shortcut: {confirmProviderRemove.name}</h2>
      <p>Remove “{confirmProviderRemove.name}” from your BL-HAOS library? The Home Assistant playlist itself will not be changed.</p>
      {providerRemoveError && <p className="error" role="alert">{providerRemoveError}</p>}
      <div className="row-actions">
        <button className="neu-button" type="button" ref={keepShortcutButton} disabled={Boolean(removingProviderRecordId)} onClick={closeConfirmation}>Keep shortcut</button>
        <button className="neu-button destructive-button" type="button" disabled={Boolean(removingProviderRecordId)} onClick={() => void removeProviderShortcut()}>
          {removingProviderRecordId ? 'Removing shortcut...' : 'Remove shortcut'}
        </button>
      </div>
    </dialog>}
    {confirmDiscard && <dialog ref={discardDialog} aria-modal="true" aria-labelledby="discard-changes-heading" className="confirmation-dialog"
      onKeyDown={handleDialogKeyDown} onCancel={(event) => { event.preventDefault(); closeConfirmation(); }}>
      <h2 id="discard-changes-heading">Discard changes</h2>
      <p>Discard unsaved changes to “{editingRecord?.name || draftName || 'this playlist'}”? The saved playlist will remain unchanged.</p>
      <div className="row-actions">
        <button className="neu-button" type="button" ref={keepEditingButton} onClick={() => { closeAfterDiscard.current = false; setConfirmDiscard(false); }}>Keep editing</button>
        <button className="neu-button destructive-button" type="button" onClick={() => {
          const closePanel = closeAfterDiscard.current;
          closeAfterDiscard.current = false;
          setConfirmDiscard(false);
          finishEditing();
          navigateAfterDiscard.current = closePanel;
        }}>Discard changes</button>
      </div>
    </dialog>}
    {confirmQueueLaunch && <dialog ref={queueLaunchDialog} aria-modal="true" aria-labelledby="replace-queue-heading" className="confirmation-dialog"
      onKeyDown={handleDialogKeyDown} onCancel={(event) => { event.preventDefault(); if (!queueLaunchPendingId) closeConfirmation(); }}>
      <h2 id="replace-queue-heading">Replace queue</h2>
      <p>Replace queue: Stop the current queue on {targetLabel} and play “{confirmQueueLaunch.name}”?</p>
      {queueLaunchPendingId && <p role="status" aria-live="polite" aria-atomic="true">Preparing “{confirmQueueLaunch.name}” for {targetLabel}…</p>}
      {queueLaunchErrors[confirmQueueLaunch.record_id] && <p className="error" role="alert">{queueLaunchErrors[confirmQueueLaunch.record_id]}</p>}
      <div className="row-actions">
        <button className="neu-button" type="button" ref={keepCurrentQueueButton} disabled={Boolean(queueLaunchPendingId)} onClick={closeConfirmation}>Keep current queue</button>
        <button className="neu-button primary-button" type="button" disabled={!targetAvailable || Boolean(queueLaunchPendingId)}
          onClick={() => void startSavedPlaylist(confirmQueueLaunch)}>
          {queueLaunchPendingId ? 'Preparing...' : 'Replace queue'}
        </button>
      </div>
    </dialog>}
  </main>;
}

const styles = `
:host { display:block; min-width:0; height:100%; color-scheme:dark;
  --neu-page:#151a23; --neu-surface:#242d3b; --neu-raised:#313d4f; --neu-deep:#0f141c;
  --neu-text:#eef2f7; --neu-muted:#b6c2d2; --neu-border:rgba(148,163,184,.18);
  font-family:ui-sans-serif,sans-serif; font-size:14px; color:var(--neu-text); letter-spacing:0; }
* { box-sizing:border-box; }
.neu-page { height:100dvh; min-height:0; padding:24px; background:var(--neu-page); display:flex; flex-direction:column; gap:16px; overflow-y:auto; }
.catalog-header { display:flex; align-items:center; justify-content:space-between; gap:24px; }
.catalog-heading { display:flex; align-items:center; gap:16px; min-width:0; }
.catalog-header > * { min-width:0; }
.close-catalog { text-decoration:none; align-self:center; }
.selected-target { font-size:16px; font-weight:600; line-height:1.2; overflow-wrap:anywhere; color:#93c5fd; }
.catalog-path { display:flex; flex-wrap:wrap; align-items:center; gap:8px; min-width:0; overflow-wrap:anywhere; }
.view-toggle { display:flex; gap:8px; }
.view-toggle [aria-pressed="true"] { box-shadow:inset 0 0 0 2px #3b82f6; }
.catalog-path button { min-width:44px; max-width:100%; overflow-wrap:anywhere; text-align:left; }
.catalog-path [aria-current] { color:#93c5fd; }
.catalog-search { display:flex; align-items:end; flex-wrap:wrap; gap:8px; padding:16px; }
.search-control { display:grid; gap:8px; flex:1; min-width:0; }
.catalog-body { min-height:0; overflow-y:auto; overscroll-behavior:contain; }
.library-body { display:grid; gap:16px; padding:16px; min-width:0; overflow-y:auto; }
.queue-summary { flex:0 0 auto; }
.queue-summary-body { display:grid; gap:4px; padding:16px; min-width:0; overflow-wrap:anywhere; }
.queue-playlist { font-size:16px; font-weight:600; line-height:1.2; }
.provider-library-body { min-height:0; overflow-y:auto; overscroll-behavior:contain; }
.provider-library .media-detail { display:flex; flex-direction:column; align-items:flex-start; }
.library-body > .empty-state { padding:24px 0; }
.library-message { margin:0; }
.playlist-form { display:grid; gap:8px; max-width:480px; }
.playlist-form h3 { margin:16px 0 0; font-size:16px; font-weight:600; line-height:1.2; }
.playlist-entries { min-width:0; max-height:40vh; overflow-y:auto; overscroll-behavior:contain; border:1px solid var(--neu-border); border-radius:8px; }
.playlist-entries li { grid-template-columns:48px minmax(0,1fr) auto; }
.playlist-entries .empty-entry { display:block; min-height:80px; padding:24px 16px; color:var(--neu-muted); }
.entry-actions { flex-wrap:wrap; }
.editor-actions { flex-wrap:wrap; }
.provider-rename-form { display:grid; gap:8px; width:100%; }
.provider-actions { flex-wrap:wrap; }
.media-title.provider-title { display:block; overflow:visible; overflow-wrap:anywhere; -webkit-line-clamp:unset; -webkit-box-orient:unset; }
.primary-button { background:#3b82f6; border-color:#3b82f6; color:#fff; }
.destructive-button { color:#fda4af; }
.confirmation-dialog { width:min(560px,calc(100vw - 48px)); max-height:calc(100dvh - 48px); overflow:auto; padding:24px; color:var(--neu-text); background:var(--neu-surface); border:1px solid var(--neu-border); border-radius:8px; box-shadow:0 20px 60px rgba(0,0,0,.55); }
.confirmation-dialog::backdrop { background:rgba(0,0,0,.72); }
.confirmation-dialog h2 { padding:0 0 16px; border:0; }
.confirmation-dialog p { line-height:1.5; overflow-wrap:anywhere; }
.confirmation-dialog .row-actions { justify-content:flex-end; flex-wrap:wrap; margin-top:24px; }
.empty-state { padding:24px 16px; }
.empty-state h3 { font-size:16px; font-weight:600; margin:0; }
.empty-state p { line-height:1.5; }
li[aria-current="true"] { background:rgba(59,130,246,.12); box-shadow:inset 3px 0 #3b82f6; }
h1 { font-size:24px; font-weight:600; line-height:1.2; margin:4px 0 0; }
h2 { font-size:16px; font-weight:600; line-height:1.2; margin:0; padding:24px 16px; border-bottom:1px solid var(--neu-border); flex-shrink:0; overflow-wrap:anywhere; }
.eyebrow,.metadata { color:var(--neu-muted); font-size:12px; font-weight:400; line-height:1.5; margin:0; }
.target-control { display:grid; gap:8px; width:320px; max-width:100%; flex-shrink:0; }
select,button,input,a { font:inherit; color:inherit; min-height:44px; border-radius:8px; }
.neu-inset { width:100%; padding:8px 12px; background:var(--neu-deep); border:1px solid rgba(148,163,184,.45); }
.neu-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:8px 16px; background:var(--neu-raised); border:1px solid rgba(148,163,184,.45); cursor:pointer; transition:background-color 150ms; max-width:100%; overflow-wrap:anywhere; }
.neu-button:hover:not(:disabled) { background:#3b4a60; }
button:disabled { opacity:.55; cursor:default; }
.icon-button { width:44px; height:44px; padding:0; flex-shrink:0; }
.neu-surface { display:flex; flex-direction:column; min-height:160px; flex:1; overflow:hidden; background:var(--neu-surface); border:1px solid var(--neu-border); border-radius:8px; box-shadow:inset 0 1px rgba(148,163,184,.07),0 10px 24px -16px rgba(5,8,12,.55); }
ul { list-style:none; padding:0; margin:0; }
li { display:grid; grid-template-columns:48px minmax(0,1fr) auto; align-items:center; gap:16px; padding:16px; min-height:80px; border-bottom:1px solid var(--neu-border); }
li:last-child { border-bottom:0; }
.thumbnail { width:48px; height:48px; object-fit:cover; border-radius:4px; }
.media-icon { justify-self:center; color:var(--neu-muted); }
.media-detail { display:grid; gap:4px; min-width:0; overflow-wrap:anywhere; }
.media-title { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.5; }
.row-actions { display:flex; gap:8px; }
.status { min-height:18px; margin:0; font-size:12px; line-height:1.5; color:#6ee7b7; overflow-wrap:anywhere; }
.error,.warning { padding:16px 0; overflow-wrap:anywhere; line-height:1.5; }
.error { color:#fda4af; } .warning { color:#fcd34d; }
.neu-surface > p { margin:24px 16px; }
:focus-visible { outline:2px solid #67e8f9; outline-offset:2px; }
@media(min-width:768px) { .neu-page { padding:40px; } }
@media(max-width:640px) { .catalog-header { align-items:stretch; flex-direction:column; } .target-control { width:100%; }
  .close-catalog { align-self:flex-start; }
  li { grid-template-columns:48px minmax(0,1fr); gap:8px 16px; } .row-actions { grid-column:2; flex-wrap:wrap; }
  .playlist-entries li { grid-template-columns:40px minmax(0,1fr); } .playlist-entries .entry-actions { grid-column:2; } }
@media(prefers-reduced-motion:reduce) { * { transition:none !important; } }
`;

export class MediaPanelElement extends HTMLElement {
  private suppliedHass?: Hass;
  private root?: Root;
  private mount: HTMLDivElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    this.mount = document.createElement('div');
    shadow.append(style, this.mount);
  }

  set hass(value: Hass | undefined) {
    this.suppliedHass = value;
    this.render();
  }

  get hass(): Hass | undefined { return this.suppliedHass; }

  connectedCallback() {
    this.root = createRoot(this.mount);
    this.render();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
  }

  private render() { this.root?.render(<MediaPanel hass={this.suppliedHass} />); }
}

if (!customElements.get('bl-haos-media-panel')) {
  customElements.define('bl-haos-media-panel', MediaPanelElement);
}
