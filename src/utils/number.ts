const TEN_THOUSAND = 10_000;
const HUNDRED_MILLION = 100_000_000;
const TRILLION = 1_0000_0000_0000;

const KOREAN_UNITS = [
    { value: TRILLION, suffix: "조" },
    { value: HUNDRED_MILLION, suffix: "억" },
    { value: TEN_THOUSAND, suffix: "만" },
] as const;

type CompactOptions = {
    style?: "compact";
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
};

type DetailedOptions = {
    style: "detailed";
};

export type FormatKoreanCurrencyOptions = CompactOptions | DetailedOptions | undefined;

const formatKoreanCompact = (value: number, options?: CompactOptions) => {
    const sign = value < 0 ? "-" : "";
    const absolute = Math.abs(value);

    if (absolute < TEN_THOUSAND) {
        const formatted = new Intl.NumberFormat("ko-KR", {
            maximumFractionDigits: options?.maximumFractionDigits,
            minimumFractionDigits: options?.minimumFractionDigits,
        }).format(absolute);
        return `${sign}${formatted}`;
    }

    const unit = KOREAN_UNITS.find((entry) => absolute >= entry.value) ?? KOREAN_UNITS[KOREAN_UNITS.length - 1];
    const amount = absolute / unit.value;
    const hasFraction = !Number.isInteger(amount);
    const formatted = new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: hasFraction ? options?.minimumFractionDigits ?? 0 : 0,
        maximumFractionDigits: hasFraction ? options?.maximumFractionDigits ?? 1 : 0,
    }).format(amount);

    return `${sign}${formatted}${unit.suffix}`;
};

const formatKoreanDetailed = (value: number) => {
    const sign = value < 0 ? "-" : "";
    const absolute = Math.abs(value);

    if (absolute < TEN_THOUSAND) {
        if (Number.isInteger(value)) {
            return `${sign}${new Intl.NumberFormat("ko-KR").format(absolute)}`;
        }
        return `${sign}${absolute}`;
    }

    let remainder = Math.abs(Math.trunc(value));

    const parts: string[] = [];

    const trillions = Math.floor(remainder / TRILLION);
    if (trillions > 0) {
        parts.push(`${new Intl.NumberFormat("ko-KR").format(trillions)}조`);
        remainder %= TRILLION;
    }

    const hundredMillions = Math.floor(remainder / HUNDRED_MILLION);
    if (hundredMillions > 0) {
        parts.push(`${new Intl.NumberFormat("ko-KR").format(hundredMillions)}억`);
        remainder %= HUNDRED_MILLION;
    }

    const tenThousands = Math.floor(remainder / TEN_THOUSAND);
    if (tenThousands > 0) {
        parts.push(`${new Intl.NumberFormat("ko-KR").format(tenThousands)}만`);
        remainder %= TEN_THOUSAND;
    }

    if (remainder > 0 || parts.length === 0) {
        parts.push(new Intl.NumberFormat("ko-KR").format(remainder));
    }

    return `${sign}${parts.join(" ")}`;
};

export const formatKoreanCurrency = (value: number, options?: FormatKoreanCurrencyOptions) => {
    if (!Number.isFinite(value)) {
        return String(value);
    }

    if (options?.style === "detailed") {
        return formatKoreanDetailed(value);
    }

    return formatKoreanCompact(value, options);
};

export const formatCurrencyWithFallback = (
    value: number,
    language: string,
    options?: FormatKoreanCurrencyOptions & { englishUnit?: { divisor: number; suffix: string; maximumFractionDigits?: number } },
) => {
    if (language === "ko") {
        return formatKoreanCurrency(value, options);
    }

    const divisor = options?.englishUnit?.divisor ?? 1_000_000;
    const suffix = options?.englishUnit?.suffix ?? "M";
    const formatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: options?.englishUnit?.maximumFractionDigits ?? 1,
    });

    return `${formatter.format(value / divisor)} ${suffix}`;
};
