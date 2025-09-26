"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { characterListStore } from "@/stores/characterListStore";
import CalendarPanel from "@/components/todo-list/CalendarPanel";
import MemoPanel from "@/components/todo-list/MemoPanel";
import WeeklyBossPanel from "@/components/todo-list/WeeklyBossPanel";
import { Skeleton } from "@/components/ui/skeleton";
import {
    TODO_LIST_MONTHLY_BOSS_IDS,
    TODO_LIST_BOSS_MAP,
    WEEKLY_CHARACTER_CLEAR_LIMIT,
    WEEKLY_WORLD_CLEAR_LIMIT,
} from "@/constants/todoList";
import {
    TodoListEvent,
    TodoListMemo,
    MonthlyBossState,
    WeeklyBossState,
    WeeklyBossCharacterState,
    TODO_LIST_WEEKLY_STATE_VERSION,
    createEvent,
    createMemo,
    ensureTodoListCleanup,
    getAdjacentMonthKey,
    getCurrentMonthlyPeriodKey,
    getCurrentWeeklyPeriodKey,
    getDefaultCalendarMonthKey,
    getDefaultSelectedDate,
    loadCalendarEvents,
    loadMemos,
    loadMonthlyBossState,
    loadWeeklyBossState,
    saveCalendarEvents,
    saveMemos,
    saveMonthlyBossState,
    saveWeeklyBossState,
} from "@/fetchs/todoList.fetch";
import { useTranslations } from "@/providers/LanguageProvider";

const createInitialWeeklyState = (): WeeklyBossState => {
    return {
        version: TODO_LIST_WEEKLY_STATE_VERSION,
        worlds: {},
    };
};

const createInitialMonthlyState = (): MonthlyBossState => {
    const base: MonthlyBossState = {};
    TODO_LIST_MONTHLY_BOSS_IDS.forEach((bossId) => {
        base[bossId] = { clearedAt: null };
    });
    return base;
};

const sortMemos = (items: TodoListMemo[]) => {
    const getKey = (memo: TodoListMemo) => memo.dueDate ?? memo.createdAt;
    return [...items].sort((a, b) => {
        const left = getKey(a);
        const right = getKey(b);
        if (left === right) {
            return b.createdAt.localeCompare(a.createdAt);
        }
        return right.localeCompare(left);
    });
};

const sortEvents = (items: TodoListEvent[]) =>
    [...items].sort((a, b) => {
        if (a.dateKey === b.dateKey) {
            return a.createdAt.localeCompare(b.createdAt);
        }
        return a.dateKey.localeCompare(b.dateKey);
    });

const countWeeklyClears = (character: WeeklyBossCharacterState) =>
    Object.entries(character).reduce((acc, [bossId, state]) => {
        if (state?.clearedAt && TODO_LIST_BOSS_MAP[bossId]?.frequency === "weekly") {
            return acc + 1;
        }
        return acc;
    }, 0);

const getDaysInMonth = (monthKey: string) => {
    const [yearStr, monthStr] = monthKey.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (Number.isNaN(year) || Number.isNaN(month)) {
        return 30;
    }
    const date = new Date(Date.UTC(year, month, 0));
    return date.getUTCDate();
};

const TodoListPage = () => {
    const t = useTranslations();
    const weeklyPeriodKey = useMemo(() => getCurrentWeeklyPeriodKey(), []);
    const monthlyPeriodKey = useMemo(() => getCurrentMonthlyPeriodKey(), []);

    const [weeklyState, setWeeklyState] = useState<WeeklyBossState>(() => createInitialWeeklyState());
    const [monthlyState, setMonthlyState] = useState<MonthlyBossState>(() => createInitialMonthlyState());
    const [memos, setMemos] = useState<TodoListMemo[]>([]);
    const [events, setEvents] = useState<TodoListEvent[]>([]);

    const [calendarMonthKey, setCalendarMonthKey] = useState(getDefaultCalendarMonthKey);
    const [selectedDateKey, setSelectedDateKey] = useState(getDefaultSelectedDate);

    const { characters, loading: isCharacterLoading, fetchCharacters } = characterListStore();

    const [isWeeklyLoading, setWeeklyLoading] = useState(true);
    const [isMonthlyLoading, setMonthlyLoading] = useState(true);
    const [isMemoLoading, setMemoLoading] = useState(true);
    const [isEventsLoading, setEventsLoading] = useState(true);

    const handleError = useCallback(
        (error: unknown, fallbackKey: string) => {
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
        void (async () => {
            try {
                await fetchCharacters();
            } catch (error) {
                handleError(error, "todoList.toast.error");
            }
        })();
    }, [fetchCharacters, handleError]);

    useEffect(() => {
        setWeeklyLoading(true);
        void (async () => {
            try {
                const data = await loadWeeklyBossState(weeklyPeriodKey);
                setWeeklyState({
                    version: data.version ?? TODO_LIST_WEEKLY_STATE_VERSION,
                    worlds: data.worlds ?? {},
                });
            } catch (error) {
                handleError(error, "todoList.toast.error");
                setWeeklyState(createInitialWeeklyState());
            } finally {
                setWeeklyLoading(false);
            }
        })();
    }, [handleError, weeklyPeriodKey]);

    useEffect(() => {
        setMonthlyLoading(true);
        void (async () => {
            try {
                const data = await loadMonthlyBossState(monthlyPeriodKey);
                setMonthlyState(() => {
                    const base = createInitialMonthlyState();
                    Object.entries(data).forEach(([bossId, entry]) => {
                        if (base[bossId]) {
                            base[bossId] = { clearedAt: entry?.clearedAt ?? null };
                        }
                    });
                    return base;
                });
            } catch (error) {
                handleError(error, "todoList.toast.error");
                setMonthlyState(createInitialMonthlyState());
            } finally {
                setMonthlyLoading(false);
            }
        })();
    }, [handleError, monthlyPeriodKey]);

    useEffect(() => {
        setMemoLoading(true);
        void (async () => {
            try {
                const data = await loadMemos(weeklyPeriodKey);
                setMemos(sortMemos(data));
            } catch (error) {
                handleError(error, "todoList.toast.error");
                setMemos([]);
            } finally {
                setMemoLoading(false);
            }
        })();
    }, [handleError, weeklyPeriodKey]);

    useEffect(() => {
        setEventsLoading(true);
        void (async () => {
            try {
                const data = await loadCalendarEvents(calendarMonthKey);
                setEvents(sortEvents(data));
            } catch (error) {
                handleError(error, "todoList.toast.error");
                setEvents([]);
            } finally {
                setEventsLoading(false);
            }
        })();
    }, [calendarMonthKey, handleError]);

    const persistWeekly = useCallback(
        async (nextState: WeeklyBossState, previous: WeeklyBossState) => {
            try {
                await saveWeeklyBossState(weeklyPeriodKey, nextState);
            } catch (error) {
                setWeeklyState(previous);
                handleError(error, "todoList.toast.error");
            }
        },
        [handleError, weeklyPeriodKey],
    );

    const persistMonthly = useCallback(
        async (nextState: MonthlyBossState, previous: MonthlyBossState) => {
            try {
                await saveMonthlyBossState(monthlyPeriodKey, nextState);
            } catch (error) {
                setMonthlyState(previous);
                handleError(error, "todoList.toast.error");
            }
        },
        [handleError, monthlyPeriodKey],
    );

    const persistMemos = useCallback(
        async (nextMemos: TodoListMemo[], previous: TodoListMemo[], successKey?: string) => {
            try {
                await saveMemos(weeklyPeriodKey, nextMemos);
                if (successKey) {
                    toast.success(t(successKey));
                }
            } catch (error) {
                setMemos(previous);
                handleError(error, "todoList.toast.error");
            }
        },
        [handleError, t, weeklyPeriodKey],
    );

    const persistEvents = useCallback(
        async (nextEvents: TodoListEvent[], previous: TodoListEvent[], successKey?: string) => {
            try {
                await saveCalendarEvents(calendarMonthKey, nextEvents);
                if (successKey) {
                    toast.success(t(successKey));
                }
            } catch (error) {
                setEvents(previous);
                handleError(error, "todoList.toast.error");
            }
        },
        [calendarMonthKey, handleError, t],
    );

    const handleToggleWeekly = useCallback(
        (world: string, characterId: string, bossId: string, next: boolean) => {
            if (!world || !characterId) {
                return;
            }

            setWeeklyState((prev) => {
                const previous = prev;
                const worlds = { ...previous.worlds };
                const currentWorld = { ...(worlds[world] ?? {}) };
                const currentCharacter = { ...(currentWorld[characterId] ?? {}) };

                if (next) {
                    const boss = TODO_LIST_BOSS_MAP[bossId];
                    if (boss?.frequency === "weekly") {
                        const characterWeeklyClears = countWeeklyClears(currentCharacter);
                        const worldWeeklyClears = Object.values(currentWorld).reduce(
                            (acc, character) => acc + countWeeklyClears(character),
                            0,
                        );

                        if (characterWeeklyClears >= WEEKLY_CHARACTER_CLEAR_LIMIT) {
                            toast.error(
                                t("todoList.toast.weeklyCharacterLimit", {
                                    limit: WEEKLY_CHARACTER_CLEAR_LIMIT,
                                }),
                            );
                            return previous;
                        }

                        if (worldWeeklyClears >= WEEKLY_WORLD_CLEAR_LIMIT) {
                            toast.error(
                                t("todoList.toast.weeklyWorldLimit", {
                                    limit: WEEKLY_WORLD_CLEAR_LIMIT,
                                }),
                            );
                            return previous;
                        }
                    }

                    currentCharacter[bossId] = { clearedAt: new Date().toISOString() };
                } else if (currentCharacter[bossId]) {
                    delete currentCharacter[bossId];
                }

                if (Object.keys(currentCharacter).length > 0) {
                    currentWorld[characterId] = currentCharacter;
                } else {
                    delete currentWorld[characterId];
                }

                if (Object.keys(currentWorld).length > 0) {
                    worlds[world] = currentWorld;
                } else {
                    delete worlds[world];
                }

                const updated: WeeklyBossState = {
                    version: TODO_LIST_WEEKLY_STATE_VERSION,
                    worlds,
                };

                void persistWeekly(updated, previous);
                return updated;
            });
        },
        [persistWeekly, t],
    );

    const handleToggleMonthly = useCallback(
        (bossId: string, next: boolean) => {
            setMonthlyState((prev) => {
                const updated: MonthlyBossState = {
                    ...prev,
                    [bossId]: { clearedAt: next ? new Date().toISOString() : null },
                };
                void persistMonthly(updated, prev);
                return updated;
            });
        },
        [persistMonthly],
    );

    const handleAddMemo = useCallback(
        async (text: string) => {
            const memo = createMemo(text);
            setMemos((prev) => {
                const nextList = sortMemos([memo, ...prev]);
                void persistMemos(nextList, prev, "todoList.toast.memoAdded");
                return nextList;
            });
        },
        [persistMemos],
    );

    const handleToggleMemo = useCallback(
        async (memoId: string, completed: boolean) => {
            setMemos((prev) => {
                const nextList = prev.map((memo) =>
                    memo.id === memoId
                        ? { ...memo, completed, updatedAt: new Date().toISOString() }
                        : memo,
                );
                void persistMemos(nextList, prev);
                return nextList;
            });
        },
        [persistMemos],
    );

    const handleRemoveMemo = useCallback(
        async (memoId: string) => {
            setMemos((prev) => {
                const nextList = prev.filter((memo) => memo.id !== memoId);
                void persistMemos(nextList, prev, "todoList.toast.memoRemoved");
                return nextList;
            });
        },
        [persistMemos],
    );

    const handleUpdateMemo = useCallback(
        async (memoId: string, payload: { text: string; dueDate?: string | null }) => {
            setMemos((prev) => {
                const nextList = sortMemos(
                    prev.map((memo) =>
                        memo.id === memoId
                            ? {
                                  ...memo,
                                  text: payload.text,
                                  dueDate: payload.dueDate ?? undefined,
                                  updatedAt: new Date().toISOString(),
                              }
                            : memo,
                    ),
                );
                void persistMemos(nextList, prev, "todoList.toast.memoUpdated");
                return nextList;
            });
        },
        [persistMemos],
    );

    const handleCreateEvent = useCallback(
        async ({ title, friends, memo }: { title: string; friends: string[]; memo?: string }) => {
            const event = createEvent(selectedDateKey, title, friends, memo);
            setEvents((prev) => {
                const nextList = sortEvents([...prev, event]);
                void persistEvents(nextList, prev, "todoList.toast.eventAdded");
                return nextList;
            });
        },
        [persistEvents, selectedDateKey],
    );

    const handleRemoveEvent = useCallback(
        async (eventId: string) => {
            setEvents((prev) => {
                const nextList = prev.filter((event) => event.id !== eventId);
                void persistEvents(nextList, prev, "todoList.toast.eventRemoved");
                return nextList;
            });
        },
        [persistEvents],
    );

    const handleUpdateEvent = useCallback(
        async (
            eventId: string,
            payload: { dateKey: string; title: string; friends: string[]; memo?: string },
        ) => {
            setEvents((prev) => {
                const nextList = sortEvents(
                    prev.map((event) =>
                        event.id === eventId
                            ? {
                                  ...event,
                                  title: payload.title,
                                  friends: payload.friends,
                                  memo: payload.memo,
                                  dateKey: payload.dateKey,
                                  updatedAt: new Date().toISOString(),
                              }
                            : event,
                    ),
                );
                void persistEvents(nextList, prev, "todoList.toast.eventUpdated");
                return nextList;
            });
        },
        [persistEvents],
    );

    const handleSelectDate = useCallback((dateKey: string) => {
        setSelectedDateKey(dateKey);
        const monthKey = dateKey.slice(0, 7);
        setCalendarMonthKey((current) => (current === monthKey ? current : monthKey));
    }, []);

    const handleMonthChange = useCallback((amount: number) => {
        setCalendarMonthKey((prev) => {
            const next = getAdjacentMonthKey(prev, amount);
            setSelectedDateKey((current) => {
                const [, , day = "01"] = current.split("-");
                const daysInMonth = getDaysInMonth(next);
                const numericDay = Number(day);
                const safeDay = Number.isNaN(numericDay)
                    ? 1
                    : Math.min(Math.max(numericDay, 1), daysInMonth);
                return `${next}-${String(safeDay).padStart(2, "0")}`;
            });
            return next;
        });
    }, []);

    return (
        <div className="flex flex-col gap-6 pb-6">
            {isEventsLoading ? (
                <Skeleton className="h-[540px] w-full rounded-3xl" />
            ) : (
                <CalendarPanel
                    monthKey={calendarMonthKey}
                    events={events}
                    selectedDateKey={selectedDateKey}
                    onMonthChange={handleMonthChange}
                    onSelectDate={handleSelectDate}
                    onCreateEvent={handleCreateEvent}
                    onRemoveEvent={handleRemoveEvent}
                    onUpdateEvent={handleUpdateEvent}
                />
            )}

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {isWeeklyLoading || isMonthlyLoading ? (
                    <Skeleton className="h-[520px] w-full rounded-3xl" />
                ) : (
                    <WeeklyBossPanel
                        weeklyState={weeklyState}
                        monthlyState={monthlyState}
                        characters={characters}
                        charactersLoading={isCharacterLoading}
                        onToggleWeekly={handleToggleWeekly}
                        onToggleMonthly={handleToggleMonthly}
                    />
                )}

                {isMemoLoading ? (
                    <Skeleton className="h-[520px] w-full rounded-3xl" />
                ) : (
                    <MemoPanel
                        memos={memos}
                        onAdd={handleAddMemo}
                        onToggle={handleToggleMemo}
                        onRemove={handleRemoveMemo}
                        onUpdate={handleUpdateMemo}
                    />
                )}
            </div>
        </div>
    );
};

export default TodoListPage;
