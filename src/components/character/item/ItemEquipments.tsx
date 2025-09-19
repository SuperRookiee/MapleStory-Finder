import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import ItemEquipDetail from "@/components/character/item/ItemEquipDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { IItemEquipment } from "@/interface/character/ICharacter";
import { useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

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

const baseSlotClass = "flex items-center justify-center rounded-md border bg-card";
const interactiveSlotClass = "cursor-pointer transition-transform duration-150 hover:scale-[1.02] hover:shadow-md";

const getSlotStyle = (baseStyle: CSSProperties, pos: { col: number; row: number }) => ({
    ...baseStyle,
    gridColumnStart: pos.col,
    gridRowStart: pos.row,
});

type EquipmentSlotTriggerProps = {
    item: IItemEquipment;
    style: CSSProperties;
    className?: string;
};

const EquipmentSlotTrigger = ({ item, style, className }: EquipmentSlotTriggerProps) => (
    <div className={cn(baseSlotClass, interactiveSlotClass, className)} style={style}>
        <Image
            src={item.item_icon}
            alt={item.item_name}
            width={48}
            height={48}
            sizes="(max-width: 768px) 10vw, 3.5rem"
            className="h-full w-full object-contain"
            priority
        />
    </div>
);

const ItemEquipments = ({ items = [], loading }: IEquipmentGrid) => {
    const t = useTranslations();
    const slotStyle: CSSProperties = {
        width: "clamp(2rem, 7vw, 3.5rem)",
        height: "clamp(2rem, 7vw, 3.5rem)",
        padding: "clamp(0.2rem, 0.8vw, 0.45rem)",
    };
    const skeletonStyle: CSSProperties = {
        width: "clamp(1.5rem, 4.5vw, 2.5rem)",
        height: "clamp(1.5rem, 4.5vw, 2.5rem)",
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("character.item.equipment.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex w-full justify-center px-2 sm:px-4">
                <div className="grid w-fit grid-cols-5 grid-rows-6 gap-1.5 rounded-lg bg-muted p-2 sm:gap-2 sm:p-3 md:p-4">
                    {Object.entries(slotPosition).map(([slot, pos]) => {
                        const equip = items.find((item) => item.item_equipment_slot === slot);
                        const style = getSlotStyle(slotStyle, pos);

                        if (equip && !loading) {
                            return (
                                <Fragment key={slot}>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <EquipmentSlotTrigger
                                                item={equip}
                                                style={style}
                                                className="hidden sm:flex"
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent
                                            side="right"
                                            align="start"
                                            sideOffset={8}
                                            className="hidden border-none bg-transparent p-0 shadow-none sm:block"
                                        >
                                            <ItemEquipDetail item={equip} />
                                        </PopoverContent>
                                    </Popover>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <EquipmentSlotTrigger
                                                item={equip}
                                                style={style}
                                                className="flex sm:hidden"
                                            />
                                        </SheetTrigger>
                                        <SheetContent
                                            side="bottom"
                                            className="max-h-[85vh] overflow-y-auto border-none p-4 pb-6 sm:hidden"
                                        >
                                            <SheetTitle className="sr-only">{equip.item_name}</SheetTitle>
                                            <div className="flex w-full justify-center">
                                                <ItemEquipDetail item={equip} />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </Fragment>
                            );
                        }

                        return (
                            <div key={slot} className={baseSlotClass} style={style}>
                                <Skeleton className="h-full w-full" style={skeletonStyle} />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default ItemEquipments;
