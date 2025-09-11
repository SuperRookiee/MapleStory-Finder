import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
    apiKey: string | null;
}

interface IUserState {
    user: IUser;
    setUser: (user: Partial<IUser>) => void;
    setApiKey: (key: string) => void;
}

export const useUserStore = create<IUserState>()(persist((set) => ({
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
