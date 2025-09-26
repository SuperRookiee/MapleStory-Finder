const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const pad = (value: number) => value.toString().padStart(2, "0");

const toKstDate = (date: Date) => new Date(date.getTime() + KST_OFFSET_MS);

export const formatKstDateKey = (date: Date) => {
    const kst = toKstDate(date);
    const year = kst.getUTCFullYear();
    const month = pad(kst.getUTCMonth() + 1);
    const day = pad(kst.getUTCDate());
    return `${year}-${month}-${day}`;
};

export const formatKstMonthKey = (date: Date) => {
    const kst = toKstDate(date);
    const year = kst.getUTCFullYear();
    const month = pad(kst.getUTCMonth() + 1);
    return `${year}-${month}`;
};

export const getMonthStartFromKey = (monthKey: string) => `${monthKey}-01`;

export const getKstDayOfWeek = (date: Date) => {
    const kst = toKstDate(date);
    return kst.getUTCDay();
};

export const shiftMonthKey = (monthKey: string, amount: number) => {
    const [yearStr, monthStr] = monthKey.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    const shifted = new Date(Date.UTC(year, monthIndex + amount, 1));
    return formatKstMonthKey(shifted);
};

export const getWeeklyResetKey = (date: Date = new Date()) => {
    const current = toKstDate(date);
    current.setUTCHours(0, 0, 0, 0);
    const day = current.getUTCDay();
    const diff = (day + 7 - 4) % 7; // Thursday as reset day
    current.setUTCDate(current.getUTCDate() - diff);
    return formatKstDateKey(new Date(current.getTime() - KST_OFFSET_MS));
};

export const getMonthlyResetKey = (date: Date = new Date()) => {
    const current = toKstDate(date);
    current.setUTCHours(0, 0, 0, 0);
    current.setUTCDate(1);
    return formatKstDateKey(new Date(current.getTime() - KST_OFFSET_MS));
};

export const subtractMonths = (date: Date, amount: number) => {
    const current = toKstDate(date);
    current.setUTCDate(1);
    current.setUTCMonth(current.getUTCMonth() - amount);
    return new Date(current.getTime() - KST_OFFSET_MS);
};

export type CalendarDay = {
    dateKey: string;
    isCurrentMonth: boolean;
    isToday: boolean;
};

export const buildCalendarMatrix = (monthKey: string): CalendarDay[][] => {
    const [yearStr, monthStr] = monthKey.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    const firstDay = new Date(Date.UTC(year, monthIndex, 1));
    const firstDayOfWeek = getKstDayOfWeek(firstDay);
    const startDate = new Date(firstDay.getTime());
    startDate.setUTCDate(startDate.getUTCDate() - firstDayOfWeek);

    const todayKey = formatKstDateKey(new Date());
    const matrix: CalendarDay[][] = [];

    for (let week = 0; week < 6; week += 1) {
        const days: CalendarDay[] = [];
        for (let day = 0; day < 7; day += 1) {
            const cellDate = new Date(startDate.getTime());
            cellDate.setUTCDate(cellDate.getUTCDate() + week * 7 + day);
            const dateKey = formatKstDateKey(cellDate);
            const cellMonthKey = formatKstMonthKey(cellDate);
            days.push({
                dateKey,
                isCurrentMonth: cellMonthKey === monthKey,
                isToday: dateKey === todayKey,
            });
        }
        matrix.push(days);
    }

    return matrix;
};

export const formatKstMonthLabel = (monthKey: string, locale: string) => {
    const [yearStr, monthStr] = monthKey.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const date = new Date(Date.UTC(year, month, 1));
    return new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "long",
    }).format(date);
};

export const formatKstDateLabel = (dateKey: string, locale: string) => {
    const [yearStr, monthStr, dayStr] = dateKey.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const day = Number(dayStr);
    const date = new Date(Date.UTC(year, month, day));
    return new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Seoul",
        month: "long",
        day: "numeric",
        weekday: "short",
    }).format(date);
};

export const formatKstWeekRangeLabel = (dateKey: string, locale: string) => {
    const [yearStr, monthStr, dayStr] = dateKey.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const day = Number(dayStr);

    const start = new Date(Date.UTC(year, month, day));
    const end = new Date(Date.UTC(year, month, day + 6));

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Seoul",
        month: locale.startsWith("ko") ? "long" : "short",
        day: "numeric",
    };

    const formatter = new Intl.DateTimeFormat(locale, options);

    const startLabel = formatter.format(start);
    const endLabel = formatter.format(end);

    return `${startLabel} ~ ${endLabel}`;
};

export const formatRelativeFromNow = (isoDate: string, locale: string) => {
    const formatter = new Intl.RelativeTimeFormat(locale.startsWith("ko") ? "ko" : "en", { numeric: "auto" });
    const target = new Date(isoDate).getTime();
    const now = Date.now();
    const diff = target - now;
    const days = Math.round(diff / (24 * 60 * 60 * 1000));
    if (Math.abs(days) < 1) {
        const hours = Math.round(diff / (60 * 60 * 1000));
        if (Math.abs(hours) < 1) {
            const minutes = Math.round(diff / (60 * 1000));
            return formatter.format(minutes, "minute");
        }
        return formatter.format(hours, "hour");
    }
    return formatter.format(days, "day");
};
