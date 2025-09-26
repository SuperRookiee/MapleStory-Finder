"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import SymbolQuestPanel from "@/components/todo-list/SymbolQuestPanel";
import { type TranslationKey } from "@/constants/i18n/translations";
import {
    createInitialSymbolState,
    ensureTodoListCleanup,
    getCurrentWeeklyPeriodKey,
    loadSymbolQuestState,
    saveSymbolQuestState,
    SymbolQuestState,
    TODO_SYMBOL_STATE_VERSION,
} from "@/fetchs/todoList.fetch";
import { useTranslations } from "@/providers/LanguageProvider";

const SymbolTodoListPage = () => {
    const t = useTranslations();
    const weeklyPeriodKey = useMemo(() => getCurrentWeeklyPeriodKey(), []);

    const [symbolState, setSymbolState] = useState<SymbolQuestState>(() => createInitialSymbolState());
    const [loading, setLoading] = useState(true);

    const handleError = useCallback(
        (error: unknown, fallbackKey: TranslationKey) => {
            const message = error instanceof Error ? error.message : t(fallbackKey);
            toast.error(message);
        },
        [t],
    );

    useEffect(() => {
        void ensureTodoListCleanup().catch((error) => {
            handleError(error, "todoList.toast.error");
        });
    }, [handleError]);

    useEffect(() => {
        setLoading(true);
        void (async () => {
            try {
                const data = await loadSymbolQuestState(weeklyPeriodKey);
                setSymbolState(data);
            } catch (error) {
                handleError(error, "todoList.toast.error");
                setSymbolState(createInitialSymbolState());
            } finally {
                setLoading(false);
            }
        })();
    }, [handleError, weeklyPeriodKey]);

    const persistSymbolState = useCallback(
        async (nextState: SymbolQuestState, previous: SymbolQuestState) => {
            try {
                await saveSymbolQuestState(weeklyPeriodKey, nextState);
            } catch (error) {
                setSymbolState(previous);
                handleError(error, "todoList.toast.error");
            }
        },
        [handleError, weeklyPeriodKey],
    );

    const handleToggleQuest = useCallback(
        (questId: string, next: boolean) => {
            setSymbolState((prev) => {
                const previous = prev;
                const nextState: SymbolQuestState = {
                    version: TODO_SYMBOL_STATE_VERSION,
                    quests: {
                        ...prev.quests,
                        [questId]: {
                            completedAt: next ? new Date().toISOString() : null,
                        },
                    },
                };

                void persistSymbolState(nextState, previous);
                return nextState;
            });
        },
        [persistSymbolState],
    );

    return <SymbolQuestPanel state={symbolState} loading={loading} onToggle={handleToggleQuest} />;
};

export default SymbolTodoListPage;
