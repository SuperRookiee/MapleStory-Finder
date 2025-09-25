import { supabase } from "@/libs/supabaseClient";
import {
    buildCalendarMatrix,
    formatKstDateKey,
    formatKstMonthKey,
    getMonthlyResetKey,
    getMonthStartFromKey,
    getWeeklyResetKey,
    shiftMonthKey,
    subtractMonths,
} from "@/utils/date";

export type WeeklyBossState = Record<string, { clearedAt: string | null }>;

export type MonthlyBossState = { clearedAt: string | null };

export type ChecklistMemo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    updatedAt?: string | null;
};

export type ChecklistEvent = {
    id: string;
    dateKey: string;
    title: string;
    friends: string[];
    memo?: string;
    createdAt: string;
    updatedAt?: string | null;
};

export type WeeklyBossHistoryEntry = {
    periodKey: string;
    state: WeeklyBossState;
    updatedAt?: string | null;
};

export type MonthlyBossHistoryEntry = {
    periodKey: string;
    state: MonthlyBossState;
    updatedAt?: string | null;
};

type ChecklistCategory = "weekly_boss" | "monthly_boss" | "memo" | "calendar";

type ChecklistRow = {
    user_id: string;
    category: ChecklistCategory;
    period_key: string;
    data: unknown;
    updated_at?: string | null;
};

const TABLE = "check_list_entries";

const generateId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10);

const requireUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        throw new Error(error.message);
    }
    const userId = data.user?.id;
    if (!userId) {
        throw new Error("로그인이 필요합니다.");
    }
    return userId;
};

const cleanupOldEntries = async (userId: string) => {
    const now = new Date();
    const weeklyCutoff = getWeeklyResetKey(subtractMonths(now, 3));
    const monthlyCutoff = getMonthlyResetKey(subtractMonths(now, 3));

    await Promise.all([
        supabase
            .from(TABLE)
            .delete()
            .eq("user_id", userId)
            .in("category", ["weekly_boss", "memo"] satisfies ChecklistCategory[])
            .lt("period_key", weeklyCutoff),
        supabase
            .from(TABLE)
            .delete()
            .eq("user_id", userId)
            .in("category", ["monthly_boss", "calendar"] satisfies ChecklistCategory[])
            .lt("period_key", monthlyCutoff),
    ]);
};

const sanitizeWeeklyState = (value: unknown): WeeklyBossState => {
    if (!value || typeof value !== "object") {
        return {};
    }
    const entries = Object.entries(value as Record<string, unknown>);
    return entries.reduce<WeeklyBossState>((acc, [bossId, payload]) => {
        if (payload && typeof payload === "object" && "clearedAt" in payload) {
            const clearedAt = (payload as { clearedAt?: unknown }).clearedAt;
            acc[bossId] = {
                clearedAt: typeof clearedAt === "string" ? clearedAt : null,
            };
        } else {
            acc[bossId] = { clearedAt: null };
        }
        return acc;
    }, {});
};

const sanitizeMonthlyState = (value: unknown): MonthlyBossState => {
    if (!value || typeof value !== "object") {
        return { clearedAt: null };
    }
    const clearedAt = (value as { clearedAt?: unknown }).clearedAt;
    return { clearedAt: typeof clearedAt === "string" ? clearedAt : null };
};

const sanitizeMemos = (value: unknown): ChecklistMemo[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const { id, text, completed, createdAt, updatedAt } = item as Record<string, unknown>;
            if (typeof id !== "string" || typeof text !== "string" || typeof createdAt !== "string") {
                return null;
            }
            return {
                id,
                text,
                completed: Boolean(completed),
                createdAt,
                updatedAt: typeof updatedAt === "string" ? updatedAt : null,
            } satisfies ChecklistMemo;
        })
        .filter((item): item is ChecklistMemo => Boolean(item));
};

const sanitizeEvents = (value: unknown): ChecklistEvent[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const { id, title, friends, memo, createdAt, updatedAt, dateKey } = item as Record<string, unknown>;
            if (
                typeof id !== "string" ||
                typeof title !== "string" ||
                typeof createdAt !== "string" ||
                typeof dateKey !== "string"
            ) {
                return null;
            }
            const friendList = Array.isArray(friends)
                ? friends.filter((friend): friend is string => typeof friend === "string")
                : [];
            return {
                id,
                title,
                friends: friendList,
                memo: typeof memo === "string" ? memo : undefined,
                dateKey,
                createdAt,
                updatedAt: typeof updatedAt === "string" ? updatedAt : null,
            } satisfies ChecklistEvent;
        })
        .filter((item): item is ChecklistEvent => Boolean(item));
};

const fetchSingleRow = async <T>(
    userId: string,
    category: ChecklistCategory,
    periodKey: string,
    parser: (value: unknown) => T,
): Promise<T> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select("data")
        .eq("user_id", userId)
        .eq("category", category)
        .eq("period_key", periodKey)
        .limit(1);

    if (error) {
        throw new Error(error.message);
    }

    const row = (data as { data: unknown }[] | null)?.[0];
    return parser(row?.data);
};

const upsertRow = async <T extends ChecklistRow["data"]>(
    userId: string,
    category: ChecklistCategory,
    periodKey: string,
    payload: T,
) => {
    const { error } = await supabase.from(TABLE).upsert(
        {
            user_id: userId,
            category,
            period_key: periodKey,
            data: payload,
        },
        { onConflict: "user_id,category,period_key" },
    );

    if (error) {
        throw new Error(error.message);
    }
};

export const ensureChecklistCleanup = async () => {
    const userId = await requireUserId();
    await cleanupOldEntries(userId);
};

export const loadWeeklyBossState = async (periodKey: string) => {
    const userId = await requireUserId();
    return fetchSingleRow(userId, "weekly_boss", periodKey, sanitizeWeeklyState);
};

export const saveWeeklyBossState = async (periodKey: string, state: WeeklyBossState) => {
    const userId = await requireUserId();
    await upsertRow(userId, "weekly_boss", periodKey, state);
    await cleanupOldEntries(userId);
};

export const loadMonthlyBossState = async (periodKey: string) => {
    const userId = await requireUserId();
    return fetchSingleRow(userId, "monthly_boss", periodKey, sanitizeMonthlyState);
};

export const saveMonthlyBossState = async (periodKey: string, state: MonthlyBossState) => {
    const userId = await requireUserId();
    await upsertRow(userId, "monthly_boss", periodKey, state);
    await cleanupOldEntries(userId);
};

export const loadMemos = async (periodKey: string) => {
    const userId = await requireUserId();
    return fetchSingleRow(userId, "memo", periodKey, sanitizeMemos);
};

export const saveMemos = async (periodKey: string, memos: ChecklistMemo[]) => {
    const userId = await requireUserId();
    await upsertRow(userId, "memo", periodKey, memos);
    await cleanupOldEntries(userId);
};

export const loadCalendarEvents = async (monthKey: string) => {
    const userId = await requireUserId();
    const periodKey = getMonthStartFromKey(monthKey);
    return fetchSingleRow(userId, "calendar", periodKey, sanitizeEvents);
};

export const saveCalendarEvents = async (monthKey: string, events: ChecklistEvent[]) => {
    const userId = await requireUserId();
    const periodKey = getMonthStartFromKey(monthKey);
    await upsertRow(userId, "calendar", periodKey, events);
    await cleanupOldEntries(userId);
};

export const loadWeeklyBossHistory = async (months: number = 3) => {
    const userId = await requireUserId();
    const cutoff = getWeeklyResetKey(subtractMonths(new Date(), months));
    const { data, error } = await supabase
        .from(TABLE)
        .select("period_key,data,updated_at")
        .eq("user_id", userId)
        .eq("category", "weekly_boss")
        .gte("period_key", cutoff)
        .order("period_key", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (data as ChecklistRow[] | null)?.map((row) => ({
        periodKey: row.period_key,
        state: sanitizeWeeklyState(row.data),
        updatedAt: row.updated_at,
    })) ?? [];
};

export const loadMonthlyBossHistory = async (months: number = 3) => {
    const userId = await requireUserId();
    const cutoff = getMonthlyResetKey(subtractMonths(new Date(), months));
    const { data, error } = await supabase
        .from(TABLE)
        .select("period_key,data,updated_at")
        .eq("user_id", userId)
        .eq("category", "monthly_boss")
        .gte("period_key", cutoff)
        .order("period_key", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (data as ChecklistRow[] | null)?.map((row) => ({
        periodKey: row.period_key,
        state: sanitizeMonthlyState(row.data),
        updatedAt: row.updated_at,
    })) ?? [];
};

export const createMemo = (text: string): ChecklistMemo => {
    const now = new Date().toISOString();
    return {
        id: generateId(),
        text,
        completed: false,
        createdAt: now,
        updatedAt: now,
    };
};

export const createEvent = (
    dateKey: string,
    title: string,
    friends: string[],
    memo?: string,
): ChecklistEvent => {
    const now = new Date().toISOString();
    return {
        id: generateId(),
        dateKey,
        title,
        friends,
        memo,
        createdAt: now,
        updatedAt: now,
    };
};

export type ChecklistCalendarMatrix = ReturnType<typeof buildCalendarMatrix>;

export const getCalendarMatrix = (monthKey: string) => buildCalendarMatrix(monthKey);

export const getAdjacentMonthKey = (monthKey: string, amount: number) => shiftMonthKey(monthKey, amount);

export const getDefaultCalendarMonthKey = () => formatKstMonthKey(new Date());

export const getCurrentWeeklyPeriodKey = () => getWeeklyResetKey();

export const getCurrentMonthlyPeriodKey = () => getMonthlyResetKey();

export const getDefaultSelectedDate = () => formatKstDateKey(new Date());
