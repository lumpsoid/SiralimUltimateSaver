import { SaveFile } from '../core/saveFile';

type Listener = (file: SaveFile | null) => void;

let current: SaveFile | null = null;
const listeners = new Set<Listener>();

/**
 * Minimal observable store holding the currently loaded save file.
 * Replaces React's shared `useState` / prop drilling.
 */
export const saveFileStore = {
  get(): SaveFile | null
  {
    return current;
  },

  set(file: SaveFile | null): void
  {
    current = file;
    for (const listener of listeners)
    {
      listener(current);
    }
  },

  /** Subscribe to changes. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void
  {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
