import Image from "next/image";
import { IItemEquipment } from "@/interface/ICharacter";

interface ItemEquipDetailProps {
    item: IItemEquipment;
    onClose: () => void;
}

const ItemEquipDetail = ({ item, onClose }: ItemEquipDetailProps) => {
    return (
        <div className="ml-6 p-4 w-80 bg-black text-white rounded-lg shadow-lg">
            {/* 아이콘 + 이름 */}
            <div className="flex items-center gap-3 mb-2">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                        src={item.item_icon}
                        alt={item.item_name}
                        fill
                        className="object-contain"
                        sizes="48px"
                        width={0}
                        height={0}
                    />
                </div>
                <div>
                    <h3 className="font-bold text-base">{item.item_name}</h3>
                    {item.starforce && (
                        <span className="text-yellow-400 text-sm">★{item.starforce}</span>
                    )}
                </div>
            </div>

            {/* 주요 옵션 */}
            <div className="text-sm text-gray-300 space-x-2 mb-2">
                {item.item_total_option?.dex && (
                    <span>DEX {item.item_total_option.dex}</span>
                )}
                {item.item_total_option?.attack_power && (
                    <span>공 {item.item_total_option.attack_power}</span>
                )}
                {item.item_total_option?.magic_power && (
                    <span>마 {item.item_total_option.magic_power}</span>
                )}
            </div>

            {/* 잠재옵션 */}
            <div className="text-xs space-y-1">
                {item.potential_option_1 && <p>{item.potential_option_1}</p>}
                {item.potential_option_2 && <p>{item.potential_option_2}</p>}
                {item.potential_option_3 && <p>{item.potential_option_3}</p>}
            </div>

            <button
                className="mt-3 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                onClick={onClose}
            >
                닫기
            </button>
        </div>
    );
};

export default ItemEquipDetail;