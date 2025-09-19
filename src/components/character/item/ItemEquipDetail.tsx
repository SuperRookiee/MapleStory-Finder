import Image from "next/image";
import RenderOptionRow from "@/components/character/item/renderOptionRow";
import { getGradeColor } from "@/constants/option_grade_color.constant";
import { IItemEquipment } from "@/interface/character/ICharacter";
import { useTranslations } from "@/providers/LanguageProvider";

interface ItemEquipDetailProps {
    item: IItemEquipment;
}

const ItemEquipDetail = ({ item }: ItemEquipDetailProps) => {
    const t = useTranslations();

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
            className="bg-black/85 text-white rounded-lg shadow-lg w-full max-w-[min(22rem,90vw)]"
            style={{
                padding: "clamp(1rem, calc(1rem + 0.5vmin), 1.75rem)",
                fontSize: "clamp(0.8rem, calc(0.75rem + 0.2vmin), 1rem)",
                lineHeight: "clamp(1.35, calc(1.2 + 0.25vmin), 1.6)",
            }}
        >
            <div className="flex items-center gap-3 mb-2">
                {/* 아이템 아이콘 */}
                <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                        src={item.item_icon}
                        alt={item.item_name}
                        fill
                        className="object-contain"
                        sizes="40px"
                    />
                </div>

                {/* 아이템명 + 스타포스 + 등급 */}
                <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        {item.item_name}
                        {item.starforce && (
                            <span className="text-yellow-400 text-xs">★{item.starforce}</span>
                        )}
                    </h3>
                    {item.potential_option_grade && (
                        <p className="text-xs text-muted-foreground">
                            {t("character.item.equipment.potential.gradeLabel", {
                                grade: item.potential_option_grade,
                            })}
                        </p>
                    )}
                </div>
            </div>

            {/* 주요 옵션 */}
            <div className="text-sm space-y-1 mb-4">
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

            <div className="space-y-2 text-xs">
                {/* 잠재 옵션 */}
                {item.potential_option_grade && (
                    <div className={getGradeColor(item?.potential_option_grade)}>
                        <p className="mb-1 text-card-foreground">
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
                        <p className="mb-1 text-card-foreground">
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
