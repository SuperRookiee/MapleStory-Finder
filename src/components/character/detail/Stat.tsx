import { Skeleton } from "@/components/ui/skeleton";
import type { Language } from "@/constants/i18n/translations";
import { getJobInfoByName } from "@/constants/job.constant";
import { ICharacterStat } from "@/interface/character/ICharacter";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { formatKoreanCurrency } from "@/utils/number";
import { cn } from "@/utils/utils";

interface StatProps {
    stat?: ICharacterStat | null;
    characterClass?: string | null;
    loading?: boolean;
}

const formatNumberByLanguage = (value: number, language: Language) => {
    if (!Number.isFinite(value)) {
        return String(value);
    }

    if (language === "ko") {
        return formatKoreanCurrency(value, { style: "detailed" });
    }

    const locale = language === "en" ? "en-US" : undefined;
    if (Number.isInteger(value)) {
        return value.toLocaleString(locale);
    }
    return value.toLocaleString(locale, { maximumFractionDigits: 2 });
};

const formatStatValue = (value: string | undefined, language: Language) => {
    if (value === undefined || value === null || value === "") {
        return "-";
    }

    const sanitized = value.replace(/,/g, "").trim();
    const numericPattern = /^[+-]?\d+(?:\.\d+)?$/;

    if (numericPattern.test(sanitized)) {
        const numericValue = Number(sanitized);
        if (!Number.isNaN(numericValue)) {
            return formatNumberByLanguage(numericValue, language);
        }
    }

    return value;
};

export const Stat = ({ stat, characterClass, loading }: StatProps) => {
    const { language } = useLanguage();
    const t = useTranslations();
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
    const offenseStats = [
        { key: "스탯공격력", label: t("character.detail.stat.labels.statAttack") },
        { key: "공격력", label: t("character.detail.stat.labels.attackPower") },
        { key: "마력", label: t("character.detail.stat.labels.magicAttack") },
        { key: "데미지", label: t("character.detail.stat.labels.damage") },
        { key: "최종 데미지", label: t("character.detail.stat.labels.finalDamage") },
        { key: "보스 몬스터 데미지", label: t("character.detail.stat.labels.bossDamage") },
        { key: "일반 몬스터 데미지", label: t("character.detail.stat.labels.normalDamage") },
        { key: "방어율 무시", label: t("character.detail.stat.labels.ignoreDefense") },
        { key: "크리티컬 확률", label: t("character.detail.stat.labels.critRate") },
        { key: "크리티컬 데미지", label: t("character.detail.stat.labels.critDamage") },
        { key: "재사용 대기시간 감소 (초)", label: t("character.detail.stat.labels.cooldownReductionSeconds") },
        { key: "재사용 대기시간 감소 (%)", label: t("character.detail.stat.labels.cooldownReductionPercent") },
        { key: "재사용 대기시간 미적용", label: t("character.detail.stat.labels.cooldownIgnore") },
        { key: "상태이상 추가 데미지", label: t("character.detail.stat.labels.statusDamage") },
        { key: "버프 지속시간", label: t("character.detail.stat.labels.buffDuration") },
    ];
    const miscStats = [
        { key: "공격 속도", label: t("character.detail.stat.labels.attackSpeed") },
        { key: "무기 숙련도", label: t("character.detail.stat.labels.weaponMastery") },
        { key: "메소 획득량", label: t("character.detail.stat.labels.mesoObtained") },
        { key: "아이템 드롭률", label: t("character.detail.stat.labels.itemDropRate") },
        { key: "추가 경험치 획득", label: t("character.detail.stat.labels.bonusExp") },
        { key: "스타포스", label: t("character.detail.stat.labels.starForce") },
        { key: "아케인포스", label: t("character.detail.stat.labels.arcaneForce") },
        { key: "어센틱포스", label: t("character.detail.stat.labels.authenticForce") },
        { key: "이동속도", label: t("character.detail.stat.labels.speed") },
        { key: "점프력", label: t("character.detail.stat.labels.jump") },
        { key: "상태이상 내성", label: t("character.detail.stat.labels.statusResistance") },
        { key: "스탠스", label: t("character.detail.stat.labels.stance") },
    ];

    const getHighlightClass = (statKey?: string) => {
        if (!statKey) return undefined;
        const normalized = statKey.toUpperCase();
        if (mainStatSet.has(normalized)) {
            return "text-primary";
        }
        if (subStatSet.has(normalized)) {
            return "text-primary/80";
        }
        return undefined;
    };

    const formatValue = (value?: string) => formatStatValue(value, language);

    const renderRow = (label: string, value?: string, statKey?: string) => {
        const highlightClass = getHighlightClass(statKey);
        return (
            <div key={label} className="flex justify-between">
                <span className={cn("font-medium", highlightClass)}>{label}</span>
                {loading ? (
                    <Skeleton className="h-4 w-16 bg-muted-foreground" />
                ) : (
                    <span className={cn(highlightClass)}>{formatValue(value)}</span>
                )}
            </div>
        );
    };

    return (
        <div className="w-full mx-auto rounded-md overflow-hidden shadow bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="bg-neutral-200 dark:bg-neutral-700 px-4 py-4 border-b border-neutral-300 dark:border-neutral-600">
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {t("character.detail.stat.battlePower")}
                </div>
                <div className="text-2xl font-extrabold text-amber-600">
                    {loading ? <Skeleton className="h-8 w-52 mt-0.5" /> : formatValue(battlePower)}
                </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4 border-b text-sm border-neutral-300 dark:border-neutral-600">
                {mainKeys.map((key) => renderRow(key, statMap[key], key))}
            </div>

            <div className="p-4 space-y-6 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    {offenseStats.map(({ key, label }) =>
                        loading || statMap[key] ? renderRow(label, statMap[key], key) : null,
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-300 dark:border-neutral-600 pt-4">
                    {miscStats.map(({ key, label }) =>
                        loading || statMap[key] ? renderRow(label, statMap[key], key) : null,
                    )}
                </div>
            </div>
        </div>
    );
};
