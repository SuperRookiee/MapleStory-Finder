import { create } from "zustand";

type MaintenanceState = {
    isOpen: boolean;
    message: string;
    open: (message: string) => void;
    close: () => void;
};

export const maintenanceStore = create<MaintenanceState>((set) => ({
    isOpen: false,
    message: "",
    open: (message) => set({ isOpen: true, message }),
    close: () => set({ isOpen: false, message: "" }),
}));
