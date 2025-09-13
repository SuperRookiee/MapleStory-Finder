import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoriteSlice = {
    favorites: string[];
    setFavorites: (favorites: string[]) => void;
    addFavorite: (ocid: string) => void;
    removeFavorite: (ocid: string) => void;
};

export const favoriteStore = create<FavoriteSlice>()(
    persist(
        (set) => ({
            favorites: [],
            setFavorites: (favorites) => set({ favorites }),
            addFavorite: (ocid) =>
                set((state) => ({ favorites: [...state.favorites, ocid] })),
            removeFavorite: (ocid) =>
                set((state) => ({
                    favorites: state.favorites.filter((f) => f !== ocid),
                })),
        }),
        {
            name: "favoriteStore",
        }
    )
);
