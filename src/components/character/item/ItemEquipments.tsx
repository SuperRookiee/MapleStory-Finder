import Image from "next/image";
import ItemEquipDetail from "@/components/character/item/ItemEquipDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { IItemEquipment } from "@/interface/character/ICharacter";

interface IEquipmentGrid {
    items?: IItemEquipment[];
    loading?: boolean;
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
    "기계 심장": { col: 5, row: 6 },
    "뱃지": { col: 5, row: 2 },
    "훈장": { col: 5, row: 3 },
};

const ItemEquipments = ({ items = [], loading }: IEquipmentGrid) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>장비</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <div className="grid grid-cols-5 grid-rows-6 gap-2 p-4 bg-muted rounded-lg w-full max-w-[360px] md:max-w-[420px] lg:max-w-[480px]">
                    {Object.entries(slotPosition).map(([slot, pos]) => {
                        const equip = items.find((item) => item.item_equipment_slot === slot);

                        if (equip && !loading) {
                            return (
                                <Popover key={slot}>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="w-12 h-12 md:w-14 md:h-14 p-2 border rounded-md flex items-center justify-center bg-card cursor-pointer hover:shadow-md"
                                            style={{ gridColumnStart: pos.col, gridRowStart: pos.row }}
                                        >
                                            <Image
                                                src={equip.item_icon}
                                                alt={equip.item_name}
                                                width={36}
                                                height={36}
                                                className="md:w-10 md:h-10"
                                                priority
                                            />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="right"
                                        align="start"
                                        className="p-0 bg-transparent border-none shadow-none"
                                    >
                                        <ItemEquipDetail item={equip}/>
                                    </PopoverContent>
                                </Popover>
                            );
                        }

                        return (
                            <div
                                key={slot}
                                className="w-12 h-12 md:w-14 md:h-14 p-2 border rounded-md flex items-center justify-center bg-card"
                                style={{ gridColumnStart: pos.col, gridRowStart: pos.row }}
                            >
                                <Skeleton className="w-8 h-8 md:w-10 md:h-10"/>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default ItemEquipments;

