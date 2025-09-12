import Image from "next/image";
import { IItemEquipment } from "@/interface/character/ICharacter";
import { getGradeColor } from "@/constants/option_grade_color.constant";
import RenderOptionRow from "@/components/character/item/renderOptionRow";

interface ItemEquipDetailProps {
    item: IItemEquipment;
}

const ItemEquipDetail = ({ item }: ItemEquipDetailProps) => {
    console.log(item)
    const mainOptions: [string, string, string | undefined][] = [
        ["STR", "str", item.item_total_option?.str],
        ["DEX", "dex", item.item_total_option?.dex],
        ["INT", "int", item.item_total_option?.int],
        ["LUK", "luk", item.item_total_option?.luk],
        ["올스탯", "all_stat", item.item_total_option?.all_stat ? `${item.item_total_option.all_stat}%` : undefined],
        ["최대 HP", "max_hp", item.item_total_option?.max_hp],
        ["최대 MP", "max_mp", item.item_total_option?.max_mp],
        ["공격력", "attack_power", item.item_total_option?.attack_power],
        ["마력", "magic_power", item.item_total_option?.magic_power],
        ["방어력", "armor", item.item_total_option?.armor],
    ];

    const total = item.item_total_option || {};
    const base = item.item_base_option || {};
    const add = item.item_add_option || {};
    const etc = item.item_etc_option || {};
    const exceptional = item.item_exceptional_option || {};
    const star = item.item_starforce_option || {};

    return (
        <div className="bg-black/90 text-white rounded-lg shadow-lg p-4 min-w-64">
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
                        <p className="text-xs text-gray-300">({item.potential_option_grade} 아이템)</p>
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

            <div className='space-y-2 text-xs'>
                {/* 잠재 옵션 */}
                {item.potential_option_grade &&
                    <div className={getGradeColor(item?.potential_option_grade)}>
                        <p className='mb-1 text-white'>잠재옵션</p>
                        {item.potential_option_1 && <p>{item.potential_option_1}</p>}
                        {item.potential_option_2 && <p>{item.potential_option_2}</p>}
                        {item.potential_option_3 && <p>{item.potential_option_3}</p>}
                    </div>
                }
                {/* 에디셔널 잠재 */}
                {item.additional_potential_option_grade &&
                    <div className={getGradeColor(item.additional_potential_option_grade)}>
                        <p className='mb-1 text-white'>에디셔널 잠재옵션</p>
                        {item.additional_potential_option_1 && <p>{item.additional_potential_option_1}</p>}
                        {item.additional_potential_option_2 && <p>{item.additional_potential_option_2}</p>}
                        {item.additional_potential_option_3 && <p>{item.additional_potential_option_3}</p>}
                    </div>
                }
            </div>
        </div>
    );
};

export default ItemEquipDetail;