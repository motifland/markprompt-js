import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  clientId: string;
}

export const useMarkpromptStore = create(
  persist<State>(
    () => ({
      clientId: crypto.randomUUID(),
    }),
    {
      name: 'markprompt-global-store',
      version: 1,
    },
  ),
);
