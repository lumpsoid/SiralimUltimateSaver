import { el, select } from './dom';
import { alertToast } from './toast';
import { saveFileStore } from '../state/store';
import { SaveFile, decodeFile, encodeFile, isFileEncoded } from '../core/saveFile';

const MAX_FILE_SIZE = 10_000_000; // 10 Mb
const NAME_PATTERN = /.*\.sav.*/;

const saveTypeOptions = [
  { label: 'Save file (.sav)', value: 'encoded' },
  { label: 'Plain text', value: 'decoded' },
];

// Inline icons (currentColor), so no icon dependency.
const ICON_UPLOAD =
  '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" ' +
  'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"/>' +
  '<path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>';

const ICON_CHECK =
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 6 9 17l-5-5"/></svg>';

const ICON_DOWNLOAD =
  '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';

export function createFilePanel(): HTMLElement
{
  let saveType = 'encoded';
  const panel = el('section', { class: 'file-panel' });

  const buildDropzone = (): HTMLElement =>
  {
    const fileInput = el('input', {
      type: 'file',
      class: 'visually-hidden',
      accept: '.sav',
    });
    fileInput.addEventListener('change', () =>
    {
      const file = fileInput.files?.[0];
      if (file) loadFile(file);
      fileInput.value = ''; // allow re-selecting the same file later
    });

    const icon = el('span', { class: 'dropzone-icon' });
    icon.innerHTML = ICON_UPLOAD;

    const zone = el('label', { class: 'dropzone' },
      icon,
      el('p', { class: 'dropzone-title' }, 'Drop your save file here'),
      el('p', { class: 'dropzone-hint' },
        'or ', el('span', { class: 'dropzone-cta' }, 'browse'), ' to choose a .sav file',
      ),
      fileInput,
    );

    const stop = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    zone.addEventListener('dragenter', (e) => { stop(e); zone.classList.add('is-dragover'); });
    zone.addEventListener('dragover', (e) => { stop(e); zone.classList.add('is-dragover'); });
    zone.addEventListener('dragleave', (e) =>
    {
      stop(e);
      if (!zone.contains(e.relatedTarget as Node)) zone.classList.remove('is-dragover');
    });
    zone.addEventListener('drop', (e) =>
    {
      stop(e);
      zone.classList.remove('is-dragover');
      const file = (e as DragEvent).dataTransfer?.files?.[0];
      if (file) loadFile(file);
    });

    return zone;
  };

  const buildFilebar = (file: SaveFile): HTMLElement =>
  {
    const badge = el('span', { class: 'filebar-badge' });
    badge.innerHTML = ICON_CHECK;

    const { field: saveTypeField } = select(
      'Download as',
      saveTypeOptions,
      saveType,
      (value) => { saveType = value; },
    );

    const download = el('button',
      { class: 'btn', onclick: () => handleSave(saveType) },
    );
    download.innerHTML = ICON_DOWNLOAD + '<span>Download</span>';

    return el('div', { class: 'filebar' },
      badge,
      el('div', { class: 'filebar-info' },
        el('p', { class: 'filebar-name' }, file.name),
        el('p', { class: 'filebar-meta' }, 'Loaded · decrypted locally in your browser'),
      ),
      el('div', { class: 'filebar-controls' },
        saveTypeField,
        el('div', { class: 'filebar-actions' },
          el('button', { class: 'btn btn-ghost', onclick: handleClear }, 'Clear'),
          download,
        ),
      ),
    );
  };

  const render = (file: SaveFile | null) =>
  {
    panel.replaceChildren(file ? buildFilebar(file) : buildDropzone());
  };

  saveFileStore.subscribe(render);
  render(saveFileStore.get());

  return panel;
}

function loadFile(file: File): void
{
  if (file.size > MAX_FILE_SIZE)
  {
    alertToast('File bigger than 10Mb.');
    return;
  }
  if (!file.name.match(NAME_PATTERN))
  {
    alertToast('File is not a save file.');
    return;
  }

  const reader = new FileReader();
  reader.onerror = () =>
  {
    alertToast('Could not read the file.');
  };
  reader.onload = () =>
  {
    try
    {
      if (typeof reader.result !== 'string')
      {
        alertToast('File content is not a string.');
        return;
      }
      const saveFile = new SaveFile(file.name, reader.result, reader.result);
      saveFileStore.set(isFileEncoded(reader.result) ? decodeFile(saveFile) : saveFile);
    } catch (error)
    {
      console.error(error);
      alertToast(`Could not load the save file: ${(error as Error).message}`);
    }
  };
  reader.readAsText(file);
}

function handleClear(): void
{
  saveFileStore.set(null);
}

function handleSave(saveType: string): void
{
  const saveFile = saveFileStore.get();
  if (saveFile === null)
  {
    alertToast('No file selected for download.');
    return;
  }

  let blob: Blob;
  switch (saveType)
  {
    case 'encoded':
      blob = new Blob([encodeFile(saveFile).contentNew]);
      break;
    case 'decoded':
      blob = new Blob([saveFile.contentNew]);
      break;
    default:
      throw new Error('Selected invalide save type.');
  }

  const url = URL.createObjectURL(blob);
  const link = el('a', { href: url, download: Date.now().toString() + saveFile.name });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
