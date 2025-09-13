import { Skeleton } from "@/components/ui/skeleton";
import { ICharacterStat } from "@/interface/character/ICharacter";

interface StatProps {
    stat?: ICharacterStat | null;
    loading?: boolean;
}

export const Stat = ({ stat, loading }: StatProps) => {
    const highlights = ["보스 몬스터 데미지", "크리티컬 확률", "크리티컬 데미지"];

    if (loading || !stat) {
        return (
            <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100">
                <div className="bg-neutral-300 px-4 py-2">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="p-4 space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-20" />
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
        <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100 text-neutral-800">
            <div className="bg-neutral-300 px-4 py-2 text-sm font-bold">{stat.character_class} 스탯</div>
            <div className="bg-neutral-200 px-4 py-4 border-b border-neutral-300">
                <div className="text-xs text-neutral-600">전투력</div>
                <div className="text-2xl font-extrabold text-amber-600">
                    {battlePower}
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    {mainKeys.map((key) => (
                        <div key={key} className="flex justify-between">
                            <span className="font-medium">{key}</span>
                            <span>{statMap[key] ?? "-"}</span>
                        </div>
                    ))}
                </div>
                <div className="space-y-2 border-l border-neutral-300 pl-4">
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
                            <span className="font-medium">{s.stat_value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

