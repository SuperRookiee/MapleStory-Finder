import { create } from "zustand";

interface ApiKeyState {
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  apiKey: null,
  setApiKey: (key) => set({ apiKey: key }),
}));
