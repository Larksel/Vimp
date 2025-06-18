import { StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const storeUtils = {
  createStore: <T>(store: StateCreator<T>) => {
    return create<T>()(devtools(store));
  },
};
