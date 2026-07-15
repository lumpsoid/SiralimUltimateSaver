import { card, el, numberField } from './dom';
import { alertToast, notify } from './toast';
import { saveFileStore } from '../state/store';
import { replaceValuesByKey } from '../core/saveFile';

interface QuantityCardConfig
{
  title: string;
  /** Save-file key whose values are replaced, e.g. "MaterialQuantity". */
  key: string;
  placeholder: string;
  buttonLabel: string;
  successMessage: string;
}

/** Card that replaces every value of a given key (materials, dust). */
export function createQuantityCard(config: QuantityCardConfig): HTMLElement
{
  const { field, input } = numberField('Value', config.placeholder);

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
      alertToast('New value is not a number.');
      return;
    }

    saveFileStore.set(replaceValuesByKey(saveFile, config.key, input.value));
    input.value = '';
    notify(config.successMessage);
  };

  return card(config.title,
    field,
    el('button', { class: 'btn', onclick: add }, config.buttonLabel),
  );
}
