import Image from "next/image";
import ItemEquipDetail from "@/components/character/item/ItemEquipDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { IItemEquipment } from "@/interface/character/ICharacter";
import { useTranslations } from "@/providers/LanguageProvider";

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
    const t = useTranslations();
    const slotSize = "clamp(2.4rem, calc(2.1rem + 1.1vmin), 3.5rem)";
    const slotPadding = "clamp(0.35rem, calc(0.25rem + 0.35vmin), 0.6rem)";
    const iconSize = "clamp(1.8rem, calc(1.55rem + 0.6vmin), 2.8rem)";
    const gridGap = "clamp(0.35rem, calc(0.3rem + 0.35vmin), 0.75rem)";
    const gridPadding = "clamp(0.75rem, calc(0.5rem + 0.4vmin), 1.5rem)";

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("character.item.equipment.title")}</CardTitle>
            </CardHeader>
            <CardContent
                className="flex w-full justify-center"
                style={{
                    paddingInline: "clamp(0.5rem, calc(0.5rem + 0.5vmin), 2rem)",
                }}
            >
                <div
                    className="grid grid-cols-5 grid-rows-6 bg-muted rounded-lg w-fit"
                    style={{
                        gap: gridGap,
                        padding: gridPadding,
                    }}
                >
                    {Object.entries(slotPosition).map(([slot, pos]) => {
                        const equip = items.find((item) => item.item_equipment_slot === slot);

                        if (equip && !loading) {
                            return (
                                <Popover key={slot}>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="border rounded-md flex items-center justify-center bg-card cursor-pointer hover:shadow-md"
                                            style={{
                                                gridColumnStart: pos.col,
                                                gridRowStart: pos.row,
                                                width: slotSize,
                                                height: slotSize,
                                                padding: slotPadding,
                                            }}
                                        >
                                            <Image
                                                src={equip.item_icon}
                                                alt={equip.item_name}
                                                width={48}
                                                height={48}
                                                className="h-auto"
                                                style={{ width: iconSize }}
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
                                className="border rounded-md flex items-center justify-center bg-card"
                                style={{
                                    gridColumnStart: pos.col,
                                    gridRowStart: pos.row,
                                    width: slotSize,
                                    height: slotSize,
                                    padding: slotPadding,
                                }}
                            >
                                <Skeleton
                                    className="h-full w-full"
                                    style={{ maxWidth: iconSize, maxHeight: iconSize }}
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default ItemEquipments;

