import { Skeleton } from "@/components/ui/skeleton";
import { getJobInfoByName } from "@/constants/job.constant";
import { ICharacterStat } from "@/interface/character/ICharacter";
import { cn } from "@/utils/utils";

interface StatProps {
    stat?: ICharacterStat | null;
    characterClass?: string | null;
    loading?: boolean;
}

const formatKoreanUnits = (value: number) => {
    if (!Number.isFinite(value)) {
        return String(value);
    }

    const sign = value < 0 ? -1 : 1;
    const absValue = Math.abs(value);
    const hundredMillion = 100_000_000;
    const tenThousand = 10_000;

    if (absValue < tenThousand) {
        const smallValue = sign * absValue;
        return Number.isInteger(smallValue) ? smallValue.toLocaleString() : smallValue.toString();
    }

    const hundredMillions = Math.floor(absValue / hundredMillion);
    const remainderAfterHundred = absValue % hundredMillion;
    const tenThousands = Math.floor(remainderAfterHundred / tenThousand);
    const remainder = Math.floor(remainderAfterHundred % tenThousand);

    const parts: string[] = [];

    if (hundredMillions > 0) {
        parts.push(`${hundredMillions}억`);
    }

    if (tenThousands > 0) {
        parts.push(`${tenThousands}만`);
    }

    if (remainder > 0 || parts.length === 0) {
        parts.push(remainder.toLocaleString());
    }

    const formatted = parts.join(" ");
    return sign < 0 ? `-${formatted}` : formatted;
};

const formatStatValue = (value?: string) => {
    if (value === undefined || value === null || value === "") {
        return "-";
    }

    const sanitized = value.replace(/,/g, "").trim();
    const numericPattern = /^[+-]?\d+(?:\.\d+)?$/;

    if (numericPattern.test(sanitized)) {
        const numericValue = Number(sanitized);
        if (!Number.isNaN(numericValue)) {
            return formatKoreanUnits(numericValue);
        }
    }

    return value;
};

export const Stat = ({ stat, characterClass, loading }: StatProps) => {
    const jobInfo = getJobInfoByName(characterClass ?? stat?.character_class);

    const mainStatSet = new Set((jobInfo?.mainStat ?? []).map((key) => key.toUpperCase()));
    const subStatSet = new Set((jobInfo?.subStat ?? []).map((key) => key.toUpperCase()));

    const statEntries = stat?.final_stat ?? [];
    const statMap = statEntries.reduce<Record<string, string>>((acc, current) => {
        acc[current.stat_name] = current.stat_value;
        return acc;
    }, {});

    const battlePower = statMap["전투력"];

    const mainKeys = ["HP", "MP", "STR", "DEX", "INT", "LUK"];
    const offenseKeys = [
        "스탯공격력",
        "공격력",
        "마력",
        "데미지",
        "최종 데미지",
        "보스 몬스터 데미지",
        "일반 몬스터 데미지",
        "방어율 무시",
        "크리티컬 확률",
        "크리티컬 데미지",
        "재사용 대기시간 감소 (초)",
        "재사용 대기시간 감소 (%)",
        "재사용 대기시간 미적용",
        "상태이상 추가 데미지",
    ];
    const miscKeys = [
        "버프 지속시간",
        "공격 속도",
        "무기 숙련도",
        "메소 획득량",
        "아이템 드롭률",
        "추가 경험치 획득",
        "스타포스",
        "아케인포스",
        "어센틱포스",
        "이동속도",
        "점프력",
        "상태이상 내성",
        "스탠스",
    ];

    const getHighlightClass = (statKey?: string) => {
        if (!statKey) return undefined;
        const normalized = statKey.toUpperCase();
        if (mainStatSet.has(normalized)) {
            return "text-primary";
        }
        if (subStatSet.has(normalized)) {
            return "text-primary/70";
        }
        return undefined;
    };

    const renderRow = (label: string, value?: string, statKey?: string) => {
        const highlightClass = getHighlightClass(statKey);
        return (
            <div key={label} className="flex justify-between">
                <span className={cn("font-medium", highlightClass)}>{label}</span>
                {loading ? (
                    <Skeleton className="h-4 w-16" />
                ) : (
                    <span className={cn(highlightClass)}>{formatStatValue(value)}</span>
                )}
            </div>
        );
    };

    return (
        <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="bg-neutral-200 dark:bg-neutral-700 px-4 py-4 border-b border-neutral-300 dark:border-neutral-600">
                <div className="text-xs text-neutral-600 dark:text-neutral-400">전투력</div>
                {loading ? (
                    <Skeleton className="h-6 w-32" />
                ) : (
                    <div className="text-2xl font-extrabold text-amber-600">
                        {formatStatValue(battlePower)}
                    </div>
                )}
            </div>

            <div className="p-4 grid grid-cols-2 gap-4 border-b text-sm border-neutral-300 dark:border-neutral-600">
                {mainKeys.map((key) => renderRow(key, statMap[key], key))}
            </div>

            <div className="p-4 space-y-6 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    {offenseKeys.map((key) => (loading || statMap[key] ? renderRow(key, statMap[key]) : null))}
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-300 dark:border-neutral-600 pt-4">
                    {miscKeys.map((key) => (loading || statMap[key] ? renderRow(key, statMap[key]) : null))}
                </div>
            </div>
        </div>
    );
};
