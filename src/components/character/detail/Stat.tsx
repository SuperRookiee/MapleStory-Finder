import { Skeleton } from "@/components/ui/skeleton";
import { ICharacterStat } from "@/interface/character/ICharacter";

interface StatProps {
    stat?: ICharacterStat | null;
    loading?: boolean;
}

export const Stat = ({ stat, loading }: StatProps) => {
    const highlights = ["보스 몬스터 데미지", "크리티컬 확률", "크리티컬 데미지"];

    const formatKoreanUnits = (value: number) => {
        const hundred_million = 100_000_000;
        const ten_thousand = 10_000;

        const HM = Math.floor(value / hundred_million);
        const TT = Math.floor((value % hundred_million) / ten_thousand);
        const rest = value % ten_thousand;

        return `${HM ? `${HM}억 ` : ''}${TT ? `${TT}만 ` : ''}${rest ? rest : ''}`.trim();
    }

    if (loading || !stat) {
        return (
            <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100 dark:bg-neutral-800">
                <div className="bg-neutral-300 dark:bg-neutral-700 px-4 py-2">
                    <Skeleton className="h-4 w-32"/>
                </div>
                <div className="p-4 space-y-4">
                    <Skeleton className="h-8 w-40"/>
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-10"/>
                                <Skeleton className="h-4 w-20"/>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-4 w-16"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statMap: Record<string, string> = Object.fromEntries(
        stat.final_stat.map((s) => [s.stat_name, s.stat_value])
    );
    const mainKeys = ["HP", "MP", "STR", "DEX", "INT", "LUK"];
    const battlePower = statMap["전투력"];
    const otherStats = stat.final_stat.filter(
        (s) => !mainKeys.includes(s.stat_name) && s.stat_name !== "전투력"
    );

    return (
        <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="bg-neutral-300 dark:bg-neutral-700 px-4 py-2 text-sm font-bold">{stat.character_class}</div>
            <div className="bg-neutral-200 dark:bg-neutral-700 px-4 py-4 border-b border-neutral-300 dark:border-neutral-600">
                <div className="text-xs text-neutral-600 dark:text-neutral-400">전투력</div>
                <div className="text-2xl font-extrabold text-amber-600">
                    {formatKoreanUnits(Number(battlePower))}
                </div>
            </div>
            <div className="p-4 space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                    {mainKeys.map((key) => (
                        <div key={key} className="flex justify-between">
                            <span className="font-medium">{key}</span>
                            <span>{formatKoreanUnits(Number(statMap[key] ?? 0))}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-300 dark:border-neutral-600 pt-4">
                    {otherStats.map((s) => (
                        <div key={s.stat_name} className="flex justify-between">
                            <span
                                className={
                                    highlights.includes(s.stat_name)
                                        ? "text-amber-600 font-semibold"
                                        : undefined
                                }
                            >
                                {s.stat_name}
                            </span>
                            <span className="font-medium">{formatKoreanUnits(Number(s.stat_value))}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

