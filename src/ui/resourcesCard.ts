import { card, el, numberField, select } from './dom';
import { alertToast, notify } from './toast';
import { saveFileStore } from '../state/store';
import { SaveFile, changeValueByKey } from '../core/saveFile';

const resourceOptions = [
  { label: 'All', value: 'All' },
  { label: 'Brimstone', value: 'Brimstone' },
  { label: 'Essence', value: 'Essence' },
  { label: 'Power', value: 'Power' },
  { label: 'Crystal', value: 'Crystal' },
  { label: 'Granite', value: 'Granite' },
];

const ALL_RESOURCES = ['Brimstone', 'Essence', 'Power', 'Crystal', 'Granite'];

export function createResourcesCard(): HTMLElement
{
  let resourceType = 'Brimstone';

  const { field: typeField } = select(
    'Resource type',
    resourceOptions,
    resourceType,
    (value) => { resourceType = value; },
  );

  const { field: valueField, input } = numberField(
    'Value',
    'Enter resource new value',
  );

  const add = () =>
  {
    const saveFile = saveFileStore.get();
    if (saveFile === null)
    {
      alertToast('Provide a save file.');
      return;
    }
    if (Number.isNaN(parseInt(input.value, 10)))
    {
      notify('New value is not a number.');
      return;
    }

    const keys = resourceType === 'All' ? ALL_RESOURCES : [resourceType];
    const updated = keys.reduce<SaveFile>(
      (file, key) => changeValueByKey(file, key, input.value),
      saveFile,
    );

    saveFileStore.set(updated);
    input.value = '';
    notify(`Resource "${resourceType}" has been added.`);
  };

  return card('Add resource',
    typeField,
    valueField,
    el('button', { class: 'btn', onclick: add }, 'Add resource'),
  );
}
