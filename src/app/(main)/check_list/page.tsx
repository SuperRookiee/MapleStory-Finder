"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CalendarPanel from "@/components/check-list/CalendarPanel";
import MemoPanel from "@/components/check-list/MemoPanel";
import WeeklyBossPanel from "@/components/check-list/WeeklyBossPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { WEEKLY_BOSS_MAP } from "@/constants/checkList";
import {
    ChecklistEvent,
    ChecklistMemo,
    MonthlyBossState,
    WeeklyBossState,
    createEvent,
    createMemo,
    ensureChecklistCleanup,
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
} from "@/fetchs/checkList.fetch";
import { useTranslations } from "@/providers/LanguageProvider";

const createInitialWeeklyState = (): WeeklyBossState => {
    const base: WeeklyBossState = {};
    Object.keys(WEEKLY_BOSS_MAP).forEach((bossId) => {
        base[bossId] = { clearedAt: null };
    });
    return base;
};

const sortMemos = (items: ChecklistMemo[]) =>
    [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const sortEvents = (items: ChecklistEvent[]) =>
    [...items].sort((a, b) => {
        if (a.dateKey === b.dateKey) {
            return a.createdAt.localeCompare(b.createdAt);
        }
        return a.dateKey.localeCompare(b.dateKey);
    });

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

const CheckListPage = () => {
    const t = useTranslations();
    const weeklyPeriodKey = useMemo(() => getCurrentWeeklyPeriodKey(), []);
    const monthlyPeriodKey = useMemo(() => getCurrentMonthlyPeriodKey(), []);

    const [weeklyState, setWeeklyState] = useState<WeeklyBossState>(() => createInitialWeeklyState());
    const [monthlyState, setMonthlyState] = useState<MonthlyBossState>({ clearedAt: null });
    const [memos, setMemos] = useState<ChecklistMemo[]>([]);
    const [events, setEvents] = useState<ChecklistEvent[]>([]);

    const [calendarMonthKey, setCalendarMonthKey] = useState(getDefaultCalendarMonthKey);
    const [selectedDateKey, setSelectedDateKey] = useState(getDefaultSelectedDate);

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
        void ensureChecklistCleanup().catch((error) => {
            handleError(error, "checkList.toast.error");
        });
    }, [handleError]);

    useEffect(() => {
        setWeeklyLoading(true);
        void (async () => {
            try {
                const data = await loadWeeklyBossState(weeklyPeriodKey);
                setWeeklyState(() => {
                    const base = createInitialWeeklyState();
                    Object.entries(data).forEach(([bossId, entry]) => {
                        if (base[bossId]) {
                            base[bossId] = { clearedAt: entry?.clearedAt ?? null };
                        }
                    });
                    return base;
                });
            } catch (error) {
                handleError(error, "checkList.toast.error");
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
                setMonthlyState({ clearedAt: data.clearedAt ?? null });
            } catch (error) {
                handleError(error, "checkList.toast.error");
                setMonthlyState({ clearedAt: null });
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
                handleError(error, "checkList.toast.error");
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
                handleError(error, "checkList.toast.error");
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
                handleError(error, "checkList.toast.error");
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
                handleError(error, "checkList.toast.error");
            }
        },
        [handleError, monthlyPeriodKey],
    );

    const persistMemos = useCallback(
        async (nextMemos: ChecklistMemo[], previous: ChecklistMemo[], successKey?: string) => {
            try {
                await saveMemos(weeklyPeriodKey, nextMemos);
                if (successKey) {
                    toast.success(t(successKey));
                }
            } catch (error) {
                setMemos(previous);
                handleError(error, "checkList.toast.error");
            }
        },
        [handleError, t, weeklyPeriodKey],
    );

    const persistEvents = useCallback(
        async (nextEvents: ChecklistEvent[], previous: ChecklistEvent[], successKey?: string) => {
            try {
                await saveCalendarEvents(calendarMonthKey, nextEvents);
                if (successKey) {
                    toast.success(t(successKey));
                }
            } catch (error) {
                setEvents(previous);
                handleError(error, "checkList.toast.error");
            }
        },
        [calendarMonthKey, handleError, t],
    );

    const handleToggleWeekly = useCallback(
        (bossId: string, next: boolean) => {
            setWeeklyState((prev) => {
                const updated: WeeklyBossState = {
                    ...prev,
                    [bossId]: { clearedAt: next ? new Date().toISOString() : null },
                };
                void persistWeekly(updated, prev);
                return updated;
            });
        },
        [persistWeekly],
    );

    const handleToggleMonthly = useCallback(
        (next: boolean) => {
            setMonthlyState((prev) => {
                const updated: MonthlyBossState = { clearedAt: next ? new Date().toISOString() : null };
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
                void persistMemos(nextList, prev, "checkList.toast.memoAdded");
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
                void persistMemos(nextList, prev, "checkList.toast.memoRemoved");
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
                void persistEvents(nextList, prev, "checkList.toast.eventAdded");
                return nextList;
            });
        },
        [persistEvents, selectedDateKey],
    );

    const handleRemoveEvent = useCallback(
        async (eventId: string) => {
            setEvents((prev) => {
                const nextList = prev.filter((event) => event.id !== eventId);
                void persistEvents(nextList, prev, "checkList.toast.eventRemoved");
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
                />
            )}

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {isWeeklyLoading || isMonthlyLoading ? (
                    <Skeleton className="h-[520px] w-full rounded-3xl" />
                ) : (
                    <WeeklyBossPanel
                        weeklyState={weeklyState}
                        monthlyState={monthlyState}
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
                    />
                )}
            </div>
        </div>
    );
};

export default CheckListPage;
