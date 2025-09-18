import { create } from "zustand";

type MaintenanceState = {
    isOpen: boolean;
    message: string | null;
    open: (message?: string) => void;
    close: () => void;
};

export const maintenanceStore = create<MaintenanceState>((set) => ({
    isOpen: false,
    message: null,
    open: (message) => set({ isOpen: true, message: message ?? null }),
    close: () => set({ isOpen: false, message: null }),
}));
