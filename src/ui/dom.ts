type Props<K extends keyof HTMLElementTagNameMap> = Partial<
  Omit<HTMLElementTagNameMap[K], 'style'>
> & {
  class?: string;
  style?: Partial<CSSStyleDeclaration>;
  dataset?: Record<string, string>;
};

type Child = Node | string | null | undefined | false;

/**
 * Tiny hyperscript-style element factory.
 *
 *   el('button', { class: 'btn', onclick: fn }, 'Click me')
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props<K> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K]
{
  const node = document.createElement(tag);
  const { class: className, style, dataset, ...rest } = props;

  if (className) node.className = className;

  if (style)
  {
    Object.assign(node.style, style);
  }

  if (dataset)
  {
    for (const [key, value] of Object.entries(dataset))
    {
      node.dataset[key] = value;
    }
  }

  Object.assign(node, rest);

  for (const child of children)
  {
    if (child === null || child === undefined || child === false) continue;
    node.append(child);
  }

  return node;
}

/** Build a labelled `<select>`. Returns the wrapper and the select element. */
export function select(
  labelText: string,
  options: { label: string; value: string }[],
  defaultValue: string,
  onChange: (value: string) => void,
): { field: HTMLElement; input: HTMLSelectElement }
{
  const selectEl = el('select', { class: 'field-input' },
    ...options.map((o) =>
      el('option', { value: o.value, selected: o.value === defaultValue }, o.label),
    ),
  );
  selectEl.value = defaultValue;
  selectEl.addEventListener('change', () => onChange(selectEl.value));

  const field = el('label', { class: 'field' },
    el('span', { class: 'field-label' }, labelText),
    selectEl,
  );

  return { field, input: selectEl };
}

/** Build a labelled numeric `<input>`. */
export function numberField(
  labelText: string,
  placeholder: string,
): { field: HTMLElement; input: HTMLInputElement }
{
  const input = el('input', {
    class: 'field-input',
    type: 'number',
    min: '0',
    placeholder,
  });

  const field = el('label', { class: 'field' },
    el('span', { class: 'field-label' }, labelText),
    input,
  );

  return { field, input };
}

/** Build a card container with a title. */
export function card(title: string, ...children: Child[]): HTMLElement
{
  return el('section', { class: 'card' },
    el('h3', { class: 'card-title' }, title),
    ...children,
  );
}

/**
 * Build a labelled group of cards (e.g. "Resources", "Creatures").
 * `variant` scopes the accent colour via the `.group--<variant>` class.
 */
export function cardGroup(
  title: string,
  variant: 'resources' | 'creatures',
  ...cards: Child[]
): HTMLElement
{
  return el('section', { class: `group group--${variant}` },
    el('div', { class: 'group-header' },
      el('h2', { class: 'group-title' }, title),
      el('span', { class: 'group-rule' }),
    ),
    ...cards,
  );
}
