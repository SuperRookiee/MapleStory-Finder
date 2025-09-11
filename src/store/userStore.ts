import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    apiKey: string | null;
}

interface UserState {
    user: User;
    setUser: (user: Partial<User>) => void;
    setApiKey: (key: string) => void;
}

export const useUserStore = create<UserState>()(persist((set) => ({
        user: { apiKey: null },
        setUser: (user) =>
            set((state) => ({ user: { ...state.user, ...user } })),
        setApiKey: (key) =>
            set((state) => ({ user: { ...state.user, apiKey: key } })),
    }),
    {
        name: "user-storage", // localStorage key
    }
));
