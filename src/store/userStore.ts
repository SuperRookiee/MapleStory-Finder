import { create } from "zustand";

interface User {
  apiKey: string | null;
  // add more user fields as needed
}

interface UserState {
  user: User;
  setUser: (user: Partial<User>) => void;
  setApiKey: (key: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: { apiKey: null },
  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  setApiKey: (key) =>
    set((state) => ({ user: { ...state.user, apiKey: key } })),
}));
