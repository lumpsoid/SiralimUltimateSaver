import { el } from './dom';
import { alertToast } from './toast';
import creatureIds from '../data/creature_id.json';
import type { CreatureData } from '../core/saveFile';

const creatures = creatureIds as CreatureData;
const names = Object.keys(creatures);

let datalistSeq = 0;

/**
 * Creature name autocomplete built on a native `<input list>` + `<datalist>`.
 * Calls `onChange` with a valid creature name, or `''` when the input is
 * empty / unknown / missing data.
 */
export function createCreatureNameField(
  onChange: (value: string) => void,
): HTMLElement
{
  const listId = `creature-list-${datalistSeq++}`;

  const datalist = el('datalist', { id: listId },
    ...names.map((name) => el('option', { value: name })),
  );

  const input = el('input', {
    class: 'field-input',
    type: 'text',
    placeholder: "Creature's name",
    autocomplete: 'off',
  });
  input.setAttribute('list', listId);

  input.addEventListener('change', () =>
  {
    const value = input.value.trim();

    if (value === '')
    {
      onChange('');
      return;
    }
    if (!(value in creatures))
    {
      alertToast('Unknown creature.');
      onChange('');
      return;
    }
    if (creatures[value] === null)
    {
      alertToast('Data is missing for this creature.');
      onChange('');
      return;
    }
    onChange(value);
  });

  return el('label', { class: 'field' },
    el('span', { class: 'field-label' }, "Creature's name"),
    input,
    datalist,
  );
}
