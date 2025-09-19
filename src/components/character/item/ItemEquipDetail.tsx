import Image from "next/image";
import type { CSSProperties } from "react";
import RenderOptionRow from "@/components/character/item/renderOptionRow";
import { getGradeColor } from "@/constants/option_grade_color.constant";
import { IItemEquipment } from "@/interface/character/ICharacter";
import { useTranslations } from "@/providers/LanguageProvider";

interface ItemEquipDetailProps {
    item: IItemEquipment;
}

const ItemEquipDetail = ({ item }: ItemEquipDetailProps) => {
    const t = useTranslations();
    const panelStyle: CSSProperties = {
        width: "min(18rem, calc(100vw - 3rem))",
    };
    const iconStyle: CSSProperties = {
        width: "clamp(2.25rem, 8vw, 3rem)",
        height: "clamp(2.25rem, 8vw, 3rem)",
    };

    const mainOptions: [string, string, string | undefined][] = [
        ["STR", "str", item.item_total_option?.str],
        ["DEX", "dex", item.item_total_option?.dex],
        ["INT", "int", item.item_total_option?.int],
        ["LUK", "luk", item.item_total_option?.luk],
        [
            t("character.item.equipment.mainOptions.allStat"),
            "all_stat",
            item.item_total_option?.all_stat ? `${item.item_total_option.all_stat}%` : undefined,
        ],
        [t("character.item.equipment.mainOptions.maxHp"), "max_hp", item.item_total_option?.max_hp],
        [t("character.item.equipment.mainOptions.maxMp"), "max_mp", item.item_total_option?.max_mp],
        [
            t("character.item.equipment.mainOptions.attackPower"),
            "attack_power",
            item.item_total_option?.attack_power,
        ],
        [
            t("character.item.equipment.mainOptions.magicPower"),
            "magic_power",
            item.item_total_option?.magic_power,
        ],
        [t("character.item.equipment.mainOptions.armor"), "armor", item.item_total_option?.armor],
    ];

    const base = item.item_base_option || {};
    const add = item.item_add_option || {};
    const etc = item.item_etc_option || {};
    const exceptional = item.item_exceptional_option || {};
    const star = item.item_starforce_option || {};

    return (
        <div
            className="bg-black/85 text-white rounded-lg shadow-lg p-3 sm:p-4 border border-foreground/50"
            style={panelStyle}
        >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                {/* 아이템 아이콘 */}
                <div className="relative flex-shrink-0" style={iconStyle}>
                    <Image
                        src={item.item_icon}
                        alt={item.item_name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 12vw, 3rem"
                    />
                </div>

                {/* 아이템명 + 스타포스 + 등급 */}
                <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                        {item.item_name}
                        {item.starforce && (
                            <span className="text-yellow-400 text-[0.7rem] sm:text-xs">★{item.starforce}</span>
                        )}
                    </h3>
                    {item.potential_option_grade && (
                        <p className="text-[0.7rem] sm:text-xs text-muted-foreground">
                            {t("character.item.equipment.potential.gradeLabel", {
                                grade: item.potential_option_grade,
                            })}
                        </p>
                    )}
                </div>
            </div>

            {/* 주요 옵션 */}
            <div className="text-xs sm:text-sm space-y-1.5 mb-3 sm:mb-4">
                {mainOptions.map(([label, statKey, totalValue]) => (
                    <RenderOptionRow
                        key={label}
                        label={label}
                        statKey={statKey}
                        totalValue={totalValue}
                        base={base}
                        add={add}
                        etc={etc}
                        exceptional={exceptional}
                        star={star}
                    />
                ))}
            </div>

            <div className="space-y-2 text-[0.7rem] sm:text-xs">
                {/* 잠재 옵션 */}
                {item.potential_option_grade && (
                    <div className={getGradeColor(item?.potential_option_grade)}>
                        <p className="mb-1 text-card-foreground text-xs">
                            {t("character.item.equipment.potential.label")}
                        </p>
                        {item.potential_option_1 && <p>{item.potential_option_1}</p>}
                        {item.potential_option_2 && <p>{item.potential_option_2}</p>}
                        {item.potential_option_3 && <p>{item.potential_option_3}</p>}
                    </div>
                )}
                {/* 에디셔널 잠재 */}
                {item.additional_potential_option_grade && (
                    <div className={getGradeColor(item.additional_potential_option_grade)}>
                        <p className="mb-1 text-card-foreground text-xs">
                            {t("character.item.equipment.additionalPotential.label")}
                        </p>
                        {item.additional_potential_option_1 && <p>{item.additional_potential_option_1}</p>}
                        {item.additional_potential_option_2 && <p>{item.additional_potential_option_2}</p>}
                        {item.additional_potential_option_3 && <p>{item.additional_potential_option_3}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemEquipDetail;
