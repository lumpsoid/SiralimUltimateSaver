import { card, el, select } from './dom';
import { alertToast } from './toast';
import { saveFileStore } from '../state/store';
import { SaveFile, decodeFile, encodeFile, isFileEncoded } from '../core/saveFile';

const MAX_FILE_SIZE = 10_000_000; // 10 Mb
const NAME_PATTERN = /.*\.sav.*/;

const saveTypeOptions = [
  { label: 'save file', value: 'encoded' },
  { label: 'text', value: 'decoded' },
];

export function createFileUploaderCard(): HTMLElement
{
  let saveType = 'encoded';

  const fileInput = el('input', { type: 'file', class: 'visually-hidden' });
  fileInput.addEventListener('change', () => handleFileChange(fileInput));

  const chooseButton = el('label', { class: 'btn' }, 'Choose save file', fileInput);

  const status = el('div');

  const { field: saveTypeField } = select(
    'Save as',
    saveTypeOptions,
    saveType,
    (value) => { saveType = value; },
  );

  const render = (file: SaveFile | null) =>
  {
    status.replaceChildren();
    if (file)
    {
      status.append(
        el('p', { class: 'file-name' }, `Selected file: ${file.name}`),
        el('div', { class: 'btn-row' },
          el('button', { class: 'btn', onclick: handleClear }, 'Clear file'),
          el('button', { class: 'btn', onclick: () => handleSave(saveType) }, 'Save'),
        ),
      );
    } else
    {
      status.append(chooseButton);
    }
  };

  saveFileStore.subscribe(render);
  render(saveFileStore.get());

  return card('Save file', status, saveTypeField);
}

function handleFileChange(input: HTMLInputElement): void
{
  const file = input.files?.[0];
  if (!file)
  {
    alertToast('File is not found.');
    return;
  }
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
    } finally
    {
      // Allow re-selecting the same file later.
      input.value = '';
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
