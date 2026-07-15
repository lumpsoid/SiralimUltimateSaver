import { card, el, select } from './dom';
import { alertToast, notify } from './toast';
import { createCreatureNameField } from './creatureNameField';
import { saveFileStore } from '../state/store';
import { Knowledge, addKnowledge } from '../core/saveFile';
import creatureData from '../data/creature_id.json';

const knowledgeOptions = [
  { label: 'S', value: Knowledge.S },
  { label: 'A', value: Knowledge.A },
  { label: 'B', value: Knowledge.B },
  { label: 'C', value: Knowledge.C },
  { label: 'D', value: Knowledge.D },
  { label: 'E', value: Knowledge.E },
  { label: 'F', value: Knowledge.F },
];

export function createKnowledgeCard(): HTMLElement
{
  let creatureName = '';
  let knowledgeValue: Knowledge = Knowledge.S;

  const nameField = createCreatureNameField((value) => { creatureName = value; });

  const { field: knowledgeField } = select(
    'Knowledge',
    knowledgeOptions,
    Knowledge.S,
    (value) => { knowledgeValue = value as Knowledge; },
  );

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
      alertToast('Choose creature.');
      return;
    }

    saveFileStore.set(addKnowledge(saveFile, creatureData, creatureName, knowledgeValue));
    notify(`Knowledge for "${creatureName}" was added.`);
  };

  return card('Add knowledge',
    nameField,
    knowledgeField,
    el('button', { class: 'btn', onclick: add }, 'Add knowledge'),
  );
}
