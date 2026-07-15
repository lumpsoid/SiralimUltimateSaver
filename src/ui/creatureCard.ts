import { card, el, select } from './dom';
import { alertToast, notify } from './toast';
import { createCreatureNameField } from './creatureNameField';
import { saveFileStore } from '../state/store';
import { Personality, creatureAdd } from '../core/saveFile';
import creatureData from '../data/creature_id.json';
import creatureTemplate from '../data/creature_template.json';

const personalityOptions = [
  { label: '⇧Health ⇩Attack', value: Personality.HA },
  { label: '⇧Health ⇩Defense', value: Personality.HD },
  { label: '⇧Health ⇩Intelligence', value: Personality.HI },
  { label: '⇧Health ⇩Speed', value: Personality.HS },
  { label: '⇧Attack ⇩Health', value: Personality.AH },
  { label: '⇧Attack ⇩Defense', value: Personality.AD },
  { label: '⇧Attack ⇩Intelligence', value: Personality.AI },
  { label: '⇧Attack ⇩Speed', value: Personality.AS },
  { label: '⇧Defense ⇩Health', value: Personality.DH },
  { label: '⇧Defense ⇩Attack', value: Personality.DA },
  { label: '⇧Defense ⇩Intelligence', value: Personality.DI },
  { label: '⇧Defense ⇩Speed', value: Personality.DS },
  { label: '⇧Intelligence ⇩Health', value: Personality.IH },
  { label: '⇧Intelligence ⇩Attack', value: Personality.IA },
  { label: '⇧Intelligence ⇩Defense', value: Personality.ID },
  { label: '⇧Intelligence ⇩Speed', value: Personality.IS },
  { label: '⇧Speed ⇩Health', value: Personality.SH },
  { label: '⇧Speed ⇩Attack', value: Personality.SA },
  { label: '⇧Speed ⇩Defense', value: Personality.SD },
  { label: '⇧Speed ⇩Intelligence', value: Personality.SI },
  { label: 'None', value: Personality.NULL },
];

export function createCreatureCard(): HTMLElement
{
  let creatureName = '';
  let personalityValue: Personality = Personality.NULL;

  const nameField = createCreatureNameField((value) => { creatureName = value; });

  const { field: personalityField } = select(
    'Personality',
    personalityOptions,
    Personality.NULL,
    (value) => { personalityValue = value as Personality; },
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
      alertToast('Choose creature name.');
      return;
    }
    if (personalityValue === Personality.NULL)
    {
      alertToast('Choose creature personality.');
      return;
    }

    saveFileStore.set(
      creatureAdd(saveFile, creatureData, creatureTemplate, creatureName, personalityValue),
    );
    notify(`Creature "${creatureName}" was added.`);
  };

  return card('Add creature',
    nameField,
    personalityField,
    el('button', { class: 'btn', onclick: add }, 'Summon creature'),
  );
}
