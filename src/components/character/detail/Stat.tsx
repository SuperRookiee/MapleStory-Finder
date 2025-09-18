import { Skeleton } from "@/components/ui/skeleton";
import { ICharacterStat } from "@/interface/character/ICharacter";

interface StatProps {
    stat?: ICharacterStat | null;
    loading?: boolean;
}

export const Stat = ({ stat, loading }: StatProps) => {
    const formatKoreanUnits = (value: number) => {
        const hundred_million = 100_000_000;
        const ten_thousand = 10_000;
        const HM = Math.floor(value / hundred_million);
        const TT = Math.floor((value % hundred_million) / ten_thousand);
        const rest = value % ten_thousand;
        return `${HM ? `${HM}억 ` : ""}${TT ? `${TT}만 ` : ""}${rest ? rest : ""}`.trim();
    };

    if (!stat) return null;

    const statMap: Record<string, string> = Object.fromEntries(
        stat.final_stat.map(s => [s.stat_name, s.stat_value])
    );

    const battlePower = statMap["전투력"];

    const mainKeys = ["HP", "MP", "STR", "DEX", "INT", "LUK" ];
    const offenseKeys = [
        "스탯공격력", "공격력", "마력", "데미지", "최종 데미지",
        "보스 몬스터 데미지", "일반 몬스터 데미지", "방어율 무시", "크리티컬 확률", "크리티컬 데미지",
        "재사용 대기시간 감소 (초)", "재사용 대기시간 감소 (%)", "재사용 대기시간 미적용", "상태이상 추가 데미지",
    ];
    const miscKeys = [
        "버프 지속시간", "공격 속도", "무기 숙련도",
        "메소 획득량", "아이템 드롭률", "추가 경험치 획득",
        "스타포스", "아케인포스", "어센틱포스",
        "이동속도", "점프력", "상태이상 내성", "스탠스",
    ];

    const renderRow = (label: string, value?: string) => (
        <div key={label} className="flex justify-between">
            <span className="font-medium">{label}</span>
            {loading ? (
                <Skeleton className="h-4 w-16"/>
            ) : (
                <span>{formatKoreanUnits(Number(value ?? 0))}</span>
            )}
        </div>
    );

    return (
        <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            {/* 1. 전투력 */}
            <div className="bg-neutral-200 dark:bg-neutral-700 px-4 py-4 border-b border-neutral-300 dark:border-neutral-600">
                <div className="text-xs text-neutral-600 dark:text-neutral-400">전투력</div>
                {loading ? (
                    <Skeleton className="h-6 w-32"/>
                ) : (
                    <div className="text-2xl font-extrabold text-amber-600">
                        {formatKoreanUnits(Number(battlePower))}
                    </div>
                )}
            </div>

            {/* 2. 주요 스탯 */}
            <div className="p-4 grid grid-cols-2 gap-4 border-b text-sm border-neutral-300 dark:border-neutral-600">
                {mainKeys.map(k => renderRow(k, statMap[k]))}
            </div>

            {/* 3. 세부 스탯 */}
            <div className="p-4 space-y-6 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    {offenseKeys.map(k => statMap[k] && renderRow(k, statMap[k]))}
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-300 dark:border-neutral-600 pt-4">
                    {miscKeys.map(k => statMap[k] && renderRow(k, statMap[k]))}
                </div>
            </div>
        </div>
    );
};