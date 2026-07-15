import { el } from './dom';

const AUTO_CLOSE_MS = 3000;

let container: HTMLElement | null = null;

function getContainer(): HTMLElement
{
  if (!container)
  {
    container = el('div', { class: 'toast-container' });
    document.body.append(container);
  }
  return container;
}

function toast(message: string, type: 'success' | 'error'): void
{
  const node = el('div', { class: `toast toast-${type}`, role: 'status' }, message);

  const remove = () =>
  {
    node.classList.add('toast-leaving');
    node.addEventListener('transitionend', () => node.remove(), { once: true });
  };

  node.addEventListener('click', remove);
  getContainer().append(node);

  window.setTimeout(remove, AUTO_CLOSE_MS);
}

/** Success notification. */
export function notify(message: string): void
{
  toast(message, 'success');
}

/** Error notification. */
export function alertToast(message: string): void
{
  toast(message, 'error');
}
