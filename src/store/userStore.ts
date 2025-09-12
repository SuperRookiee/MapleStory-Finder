import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "@/interface/IUser";

type UserSlice = {
    user: IUser;
    setUser: (user: Partial<IUser>) => void;
    setApiKey: (key: string) => void;
}

export const userStore = create<UserSlice>()(persist((set) => ({
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