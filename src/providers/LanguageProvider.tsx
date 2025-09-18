"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translate, type Language, type TranslationKey } from "@/constants/i18n/translations";

const LANGUAGE_STORAGE_KEY = "finder_language";

type LanguageContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const detectBrowserLanguage = (): Language => {
    if (typeof navigator === "undefined") return "en";
    return navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en";
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>("en");
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === "ko" || stored === "en") {
            setLanguageState(stored);
        } else {
            const detected = detectBrowserLanguage();
            setLanguageState(detected);
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, detected);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (!initialized) return;
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
        if (typeof window !== "undefined") {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        }
    }, [initialized, language]);

    const setLanguage = useCallback((next: Language) => {
        setLanguageState(next);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => (prev === "en" ? "ko" : "en"));
    }, []);

    const value = useMemo<LanguageContextValue>(() => ({
        language,
        setLanguage,
        toggleLanguage,
        t: (key, params) => translate(language, key, params),
    }), [language, setLanguage, toggleLanguage]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
};

export const useTranslations = () => useLanguage().t;
