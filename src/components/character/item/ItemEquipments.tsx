import { useState } from "react";
import { IItemEquipment } from "@/interface/ICharacter";
import ItemEquipDetail from "@/components/character/item/ItemEquipDetail";
import Image from "next/image";

interface IEquipmentGrid {
    items: IItemEquipment[];
}

// 장비 슬롯 위치 (col, row)
const slotPosition: Record<string, { col: number; row: number }> = {
    "무기": { col: 2, row: 4 },
    "보조무기": { col: 5, row: 4 },
    "엠블렘": { col: 5, row: 1 },

    "모자": { col: 3, row: 1 },
    "상의": { col: 3, row: 4 },
    "하의": { col: 3, row: 5 },

    "어깨장식": { col: 4, row: 4 },
    "장갑": { col: 4, row: 5 },
    "신발": { col: 3, row: 6 },
    "망토": { col: 5, row: 5 },

    "얼굴장식": { col: 3, row: 2 },
    "눈장식": { col: 3, row: 3 },
    "귀고리": { col: 4, row: 3 },
    "벨트": { col: 2, row: 5 },
    "펜던트": { col: 2, row: 2 },
    "펜던트2": { col: 2, row: 3 },

    "반지1": { col: 1, row: 4 },
    "반지2": { col: 1, row: 3 },
    "반지3": { col: 1, row: 2 },
    "반지4": { col: 1, row: 1 },

    "포켓 아이템": { col: 1, row: 5 },
    "뱃지": { col: 5, row: 2 },
    "훈장": { col: 5, row: 3 },
};


const ItemEquipments = ({ items }: IEquipmentGrid) => {
    const [selectedItem, setSelectedItem] = useState<IItemEquipment | null>(null);

    return (
        <div className="flex">
            {/* 장비 배치 */}
            <div className="grid grid-cols-6 grid-rows-6 gap-2 p-4 bg-gray-100 rounded-lg relative">
                {items.map((equip) => {
                    const pos = slotPosition[equip.item_equipment_slot];
                    if (!pos) return null;

                    return (
                        <div
                            key={`${equip.item_equipment_part}-${equip.item_equipment_slot}`}
                            className="w-12 h-12 border rounded flex items-center justify-center bg-white cursor-pointer hover:shadow-md"
                            style={{
                                gridColumnStart: pos.col,
                                gridRowStart: pos.row,
                            }}
                            onClick={() => setSelectedItem(equip)}
                        >
                            <Image
                                src={equip.item_icon}
                                alt={equip.item_name}
                                width={35}
                                height={35}
                                priority
                            />
                        </div>
                    );
                })}
            </div>

            {/* 상세정보 */}
            {selectedItem && (
                <ItemEquipDetail item={selectedItem} onClose={() => setSelectedItem(null)}/>
            )}
        </div>
    );
};

export default ItemEquipments;