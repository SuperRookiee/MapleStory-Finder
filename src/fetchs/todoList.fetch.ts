import { supabase } from "@/libs/supabaseClient";
import { TODO_LIST_MONTHLY_BOSS_IDS } from "@/constants/todoList";
import { buildCalendarMatrix, formatKstDateKey, formatKstMonthKey, getMonthlyResetKey, getMonthStartFromKey, getWeeklyResetKey, shiftMonthKey, subtractMonths, } from "@/utils/date";

export const TODO_LIST_WEEKLY_STATE_VERSION = 2;

export const TODO_LIST_RETENTION_MONTHS = 6;

export const TODO_LIST_UNASSIGNED_WORLD_KEY = "__unassigned__";
export const TODO_LIST_UNASSIGNED_CHARACTER_KEY = "__unassigned__";

export type BossClearState = { clearedAt: string | null };

export type WeeklyBossCharacterState = Record<string, BossClearState>;
export type WeeklyBossWorldState = Record<string, Record<string, WeeklyBossCharacterState>>;

export type WeeklyBossState = {
    version: typeof TODO_LIST_WEEKLY_STATE_VERSION;
    worlds: WeeklyBossWorldState;
};

export type MonthlyBossState = Record<string, { clearedAt: string | null }>;

export type TodoListMemo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    updatedAt?: string | null;
    dueDate?: string;
};

export type TodoListEvent = {
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

type TodoListCategory = "weekly_boss" | "monthly_boss" | "memo" | "calendar";

type TodoListRow = {
    user_id: string;
    category: TodoListCategory;
    period_key: string;
    data: unknown;
    updated_at?: string | null;
};

const TABLE = "todo_list";

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
    const retentionCutoff = subtractMonths(now, TODO_LIST_RETENTION_MONTHS);
    const weeklyCutoff = getWeeklyResetKey(retentionCutoff);
    const monthlyCutoff = getMonthlyResetKey(retentionCutoff);

    await Promise.all([
        supabase
            .from(TABLE)
            .delete()
            .eq("user_id", userId)
            .in("category", ["weekly_boss", "memo"] satisfies TodoListCategory[])
            .lt("period_key", weeklyCutoff),
        supabase
            .from(TABLE)
            .delete()
            .eq("user_id", userId)
            .in("category", ["monthly_boss", "calendar"] satisfies TodoListCategory[])
            .lt("period_key", monthlyCutoff),
    ]);
};

const createEmptyWeeklyState = (): WeeklyBossState => ({
    version: TODO_LIST_WEEKLY_STATE_VERSION,
    worlds: {},
});

const sanitizeBossEntries = (value: unknown): WeeklyBossCharacterState => {
    if (!value || typeof value !== "object") {
        return {};
    }

    return Object.entries(value as Record<string, unknown>).reduce<WeeklyBossCharacterState>((acc, [bossId, payload]) => {
        if (payload && typeof payload === "object" && "clearedAt" in payload) {
            const clearedAt = (payload as { clearedAt?: unknown }).clearedAt;
            acc[bossId] = { clearedAt: typeof clearedAt === "string" ? clearedAt : null };
        } else {
            acc[bossId] = { clearedAt: null };
        }
        return acc;
    }, {});
};

const sanitizeWeeklyState = (value: unknown): WeeklyBossState => {
    if (!value || typeof value !== "object") {
        return createEmptyWeeklyState();
    }

    const candidate = value as {
        version?: unknown;
        worlds?: unknown;
    };

    if (
        typeof candidate.version === "number" &&
        candidate.version >= TODO_LIST_WEEKLY_STATE_VERSION &&
        candidate.worlds &&
        typeof candidate.worlds === "object"
    ) {
        const sanitizedWorlds = Object.entries(candidate.worlds as Record<string, unknown>).reduce<WeeklyBossWorldState>(
            (worldAcc, [worldKey, worldValue]) => {
                if (!worldValue || typeof worldValue !== "object") {
                    return worldAcc;
                }

                const sanitizedWorld = Object.entries(worldValue as Record<string, unknown>).reduce<
                    Record<string, WeeklyBossCharacterState>
                >((characterAcc, [characterId, bossValue]) => {
                    const bosses = sanitizeBossEntries(bossValue);
                    if (Object.keys(bosses).length > 0) {
                        characterAcc[characterId] = bosses;
                    }
                    return characterAcc;
                }, {});

                if (Object.keys(sanitizedWorld).length > 0) {
                    worldAcc[worldKey] = sanitizedWorld;
                }

                return worldAcc;
            },
            {},
        );

        return {
            version: TODO_LIST_WEEKLY_STATE_VERSION,
            worlds: sanitizedWorlds,
        };
    }

    const legacyBosses = sanitizeBossEntries(value);

    if (Object.keys(legacyBosses).length === 0) {
        return createEmptyWeeklyState();
    }

    return {
        version: TODO_LIST_WEEKLY_STATE_VERSION,
        worlds: {
            [TODO_LIST_UNASSIGNED_WORLD_KEY]: {
                [TODO_LIST_UNASSIGNED_CHARACTER_KEY]: legacyBosses,
            },
        },
    };
};

const sanitizeMonthlyState = (value: unknown): MonthlyBossState => {
    const base: MonthlyBossState = {};
    TODO_LIST_MONTHLY_BOSS_IDS.forEach((bossId) => {
        base[bossId] = { clearedAt: null };
    });

    if (!value || typeof value !== "object") {
        return base;
    }

    // Legacy support for single object shape { clearedAt: string | null }
    if ("clearedAt" in (value as Record<string, unknown>)) {
        const legacyCleared = (value as { clearedAt?: unknown }).clearedAt;
        const bossId = TODO_LIST_MONTHLY_BOSS_IDS[0];
        base[bossId] = { clearedAt: typeof legacyCleared === "string" ? legacyCleared : null };
        return base;
    }

    Object.entries(value as Record<string, unknown>).forEach(([bossId, payload]) => {
        if (!base[bossId]) {
            return;
        }
        if (payload && typeof payload === "object" && "clearedAt" in payload) {
            const clearedAt = (payload as { clearedAt?: unknown }).clearedAt;
            base[bossId] = { clearedAt: typeof clearedAt === "string" ? clearedAt : null };
        }
    });

    return base;
};

const sanitizeMemos = (value: unknown): TodoListMemo[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const { id, text, completed, createdAt, updatedAt, dueDate } =
            item as Record<string, unknown>;
        if (
            typeof id !== "string" ||
            typeof text !== "string" ||
            typeof createdAt !== "string"
        ) {
            return [];
        }
        return [{
            id,
            text,
            completed: Boolean(completed),
            createdAt,
            updatedAt: typeof updatedAt === "string" ? updatedAt : null,
            dueDate: typeof dueDate === "string" ? dueDate : undefined,
        }];
    });
};

const sanitizeEvents = (value: unknown): TodoListEvent[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const { id, title, friends, memo, createdAt, updatedAt, dateKey } =
            item as Record<string, unknown>;
        if (
            typeof id !== "string" ||
            typeof title !== "string" ||
            typeof createdAt !== "string" ||
            typeof dateKey !== "string"
        ) {
            return [];
        }
        const friendList = Array.isArray(friends)
            ? friends.filter((friend): friend is string => typeof friend === "string")
            : [];
        return [{
            id,
            title,
            friends: friendList,
            memo: typeof memo === "string" ? memo : undefined,
            dateKey,
            createdAt,
            updatedAt: typeof updatedAt === "string" ? updatedAt : null,
        }];
    });
};


const fetchSingleRow = async <T>(
    userId: string,
    category: TodoListCategory,
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

const upsertRow = async <T extends TodoListRow["data"]>(
    userId: string,
    category: TodoListCategory,
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

export const ensureTodoListCleanup = async () => {
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

export const saveMemos = async (periodKey: string, memos: TodoListMemo[]) => {
    const userId = await requireUserId();
    if (memos.length === 0) {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq("user_id", userId)
            .eq("category", "memo" satisfies TodoListCategory)
            .eq("period_key", periodKey);

        if (error) {
            throw new Error(error.message);
        }
    } else {
        await upsertRow(userId, "memo", periodKey, memos);
    }
    await cleanupOldEntries(userId);
};

export const loadCalendarEvents = async (monthKey: string) => {
    const userId = await requireUserId();
    const periodKey = getMonthStartFromKey(monthKey);
    return fetchSingleRow(userId, "calendar", periodKey, sanitizeEvents);
};

export const saveCalendarEvents = async (monthKey: string, events: TodoListEvent[]) => {
    const userId = await requireUserId();
    const periodKey = getMonthStartFromKey(monthKey);
    await upsertRow(userId, "calendar", periodKey, events);
    await cleanupOldEntries(userId);
};

export const loadWeeklyBossHistory = async (
    months: number = TODO_LIST_RETENTION_MONTHS,
) => {
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

    return (data as TodoListRow[] | null)?.map((row) => ({
        periodKey: row.period_key,
        state: sanitizeWeeklyState(row.data),
        updatedAt: row.updated_at,
    })) ?? [];
};

export const loadMonthlyBossHistory = async (
    months: number = TODO_LIST_RETENTION_MONTHS,
) => {
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

    return (data as TodoListRow[] | null)?.map((row) => ({
        periodKey: row.period_key,
        state: sanitizeMonthlyState(row.data),
        updatedAt: row.updated_at,
    })) ?? [];
};

export const createMemo = (text: string, dueDate?: string | null): TodoListMemo => {
    const now = new Date().toISOString();
    return {
        id: generateId(),
        text,
        completed: false,
        createdAt: now,
        updatedAt: now,
        ...(dueDate ? { dueDate } : {}),
    };
};

export const createEvent = (
    dateKey: string,
    title: string,
    friends: string[],
    memo?: string,
): TodoListEvent => {
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

export type TodoListCalendarMatrix = ReturnType<typeof buildCalendarMatrix>;

export const getCalendarMatrix = (monthKey: string) => buildCalendarMatrix(monthKey);

export const getAdjacentMonthKey = (monthKey: string, amount: number) => shiftMonthKey(monthKey, amount);

export const getDefaultCalendarMonthKey = () => formatKstMonthKey(new Date());

export const getCurrentWeeklyPeriodKey = () => getWeeklyResetKey();

export const getCurrentMonthlyPeriodKey = () => getMonthlyResetKey();

export const getDefaultSelectedDate = () => formatKstDateKey(new Date());
