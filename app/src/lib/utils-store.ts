import { StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';

export function createStore<T>(
  store: StateCreator<T>,
) {
  return create<T>()(devtools(store));
}
