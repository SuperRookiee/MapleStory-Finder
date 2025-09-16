import { create } from "zustand";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    createdAt: number;
}

interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    addMessage: (message: Omit<ChatMessage, "id" | "createdAt"> & Partial<Pick<ChatMessage, "id" | "createdAt">>) => string;
    updateMessage: (id: string, updates: Partial<Omit<ChatMessage, "id">>) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setLoading: (loading: boolean) => void;
    clear: () => void;
}

const createMessageId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
};

export const chatStore = create<ChatState>((set) => ({
    messages: [],
    isLoading: false,
    addMessage: (message) => {
        const id = message.id ?? createMessageId();
        const createdAt = message.createdAt ?? Date.now();
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id,
                    createdAt,
                    role: message.role,
                    content: message.content,
                },
            ],
        }));
        return id;
    },
    updateMessage: (id, updates) =>
        set((state) => ({
            messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
        })),
    setMessages: (messages) => set({ messages }),
    setLoading: (loading) => set({ isLoading: loading }),
    clear: () => set({ messages: [] }),
}));
