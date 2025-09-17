import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "@/interface/IUser";

type UserSlice = {
    user: IUser;
    setUser: (user: Partial<IUser>) => void;
    setApiKey: (key: string | null) => void;
}

export const userStore = create<UserSlice>()(persist((set) => ({
        user: { apiKey: null, isGuest: false },
        setUser: (user) =>
            set((state) => ({ user: { ...state.user, ...user } })),
        setApiKey: (key) =>
            set((state) => ({ user: { ...state.user, apiKey: key } })),
    }),
    {
        name: "userStore",
    }
));