import { card, el } from './dom';
import { alertToast, notify } from './toast';
import { createCreatureNameField } from './creatureNameField';
import { saveFileStore } from '../state/store';
import { addSummon } from '../core/saveFile';
import creatureData from '../data/creature_id.json';

export function createSummonCard(): HTMLElement
{
  let creatureName = '';

  const nameField = createCreatureNameField((value) => { creatureName = value; });

  const add = () =>
  {
    const saveFile = saveFileStore.get();
    if (saveFile === null)
    {
      alertToast('Provide a save file.');
      return;
    }
    if (creatureName === '')
    {
      alertToast('Summon creature has invalide value');
      return;
    }

    saveFileStore.set(addSummon(saveFile, creatureData, creatureName));
    notify(`Summon for "${creatureName}" was added.`);
  };

  return card('Add mana for summon',
    nameField,
    el('button', { class: 'btn', onclick: add }, 'Add mana'),
  );
}
