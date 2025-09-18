"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { userStore } from "@/stores/userStore";
import { supabase } from "@/libs/supabaseClient";
import { useTranslations } from "@/providers/LanguageProvider";

const GUEST_STORAGE_KEY = "finder_guest";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "guest";

const isPublicPath = (pathname: string) =>
    pathname === "/" || pathname === "/sign_in" || pathname === "/sign_up";

export const isGuestAccessiblePath = (pathname: string) =>
    pathname === "/" || pathname === "/search" || pathname === "/chat" || pathname.startsWith("/character/");

export const isUnauthenticatedAccessiblePath = (pathname: string) =>
    pathname === "/" || pathname === "/search" || pathname.startsWith("/character/");

type AuthContextValue = {
    status: AuthStatus;
    isLoading: boolean;
    isAuthenticated: boolean;
    isGuest: boolean;
    hasApiKey: boolean;
    loginAsGuest: () => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useApplyAuthState = () => {
    const setUser = userStore((state) => state.setUser);

    return useCallback(
        (session: Session | null, guestFlag: boolean, setStatus: (status: AuthStatus) => void, setIsLoading: (value: boolean) => void) => {
            if (session) {
                const key = session.user.user_metadata?.nexon_api_key ?? null;
                setUser({ apiKey: key, isGuest: false });
                if (typeof window !== "undefined") {
                    localStorage.removeItem(GUEST_STORAGE_KEY);
                }
                setStatus("authenticated");
            } else if (guestFlag) {
                setUser({ apiKey: null, isGuest: true });
                setStatus("guest");
            } else {
                setUser({ apiKey: null, isGuest: false });
                setStatus("unauthenticated");
            }
            setIsLoading(false);
        },
        [setUser],
    );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const apiKey = userStore((state) => state.user.apiKey);
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [isLoading, setIsLoading] = useState(true);
    const applyAuthState = useApplyAuthState();
    const redirectToastPathRef = useRef<string | null>(null);
    const skipGuestGuardToastRef = useRef(false);
    const skipUnauthenticatedToastRef = useRef(false);
    const logoutToastPendingRef = useRef(false);
    const t = useTranslations();

    const syncSession = useCallback(async () => {
        setIsLoading(true);
        const storedGuest = typeof window !== "undefined" && localStorage.getItem(GUEST_STORAGE_KEY) === "true";
        const { data } = await supabase.auth.getSession();
        applyAuthState(data.session, storedGuest, setStatus, setIsLoading);
    }, [applyAuthState]);

    useEffect(() => {
        void syncSession();
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            const storedGuest = typeof window !== "undefined" && localStorage.getItem(GUEST_STORAGE_KEY) === "true";
            applyAuthState(session, storedGuest, setStatus, setIsLoading);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [applyAuthState, syncSession]);

    const loginAsGuest = useCallback(() => {
        if (typeof window === "undefined") return;
        skipGuestGuardToastRef.current = true;
        localStorage.setItem(GUEST_STORAGE_KEY, "true");
        applyAuthState(null, true, setStatus, setIsLoading);
    }, [applyAuthState]);

    const logout = useCallback(async () => {
        skipUnauthenticatedToastRef.current = true;
        logoutToastPendingRef.current = true;

        if (status === "authenticated") {
            await supabase.auth.signOut();
        }
        if (typeof window !== "undefined") {
            localStorage.removeItem(GUEST_STORAGE_KEY);
        }
        applyAuthState(null, false, setStatus, setIsLoading);
    }, [applyAuthState, status]);

    useEffect(() => {
        if (isLoading) return;

        if (status === "guest" && pathname && !isGuestAccessiblePath(pathname)) {
            if (redirectToastPathRef.current !== pathname) {
                if (!skipGuestGuardToastRef.current) {
                    toast.info(t("authProvider.toast.loginRequired"));
                }
                redirectToastPathRef.current = pathname;
            }
            skipGuestGuardToastRef.current = false;
            router.replace("/search");
            return;
        }

        if (status === "unauthenticated" && pathname) {
            if (isPublicPath(pathname) || isUnauthenticatedAccessiblePath(pathname)) {
                redirectToastPathRef.current = null;
                skipUnauthenticatedToastRef.current = false;
                if (logoutToastPendingRef.current) {
                    toast.success(t("authProvider.toast.logout"));
                    logoutToastPendingRef.current = false;
                }
                return;
            }
            if (!skipUnauthenticatedToastRef.current) {
                toast.info(t("authProvider.toast.loginRequired"));
            }
            router.replace("/sign_in");
            return;
        }

        redirectToastPathRef.current = null;
        skipGuestGuardToastRef.current = false;
    }, [isLoading, pathname, router, status]);

    const value = useMemo<AuthContextValue>(
        () => ({
            status,
            isLoading,
            isAuthenticated: status === "authenticated",
            isGuest: status === "guest",
            hasApiKey: Boolean(apiKey),
            loginAsGuest,
            logout,
        }),
        [apiKey, isLoading, loginAsGuest, logout, status],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

