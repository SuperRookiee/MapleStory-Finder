import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { IItemEquipment } from "@/interface/ICharacter";

export const ItemEquipCard = ({ item }: { item: IItemEquipment }) => {
    return (
        <Card className="flex items-center p-2 gap-3 hover:shadow-lg transition">
            {/* 아이콘 */}
            <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                    src={item.item_icon}
                    alt={item.item_name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* 정보 */}
            <CardContent className="p-0 flex-1">
                {/* 이름 + 강화정보 */}
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm">{item.item_name}</h3>
                    {item.starforce && (
                        <span className="text-yellow-500 text-xs">★{item.starforce}</span>
                    )}
                </div>

                {/* 주요 옵션 */}
                <div className="text-xs text-muted-foreground space-x-2">
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
                <div className="text-xs mt-1">
                    {item.potential_option_1 && <p>{item.potential_option_1}</p>}
                    {item.potential_option_2 && <p>{item.potential_option_2}</p>}
                    {item.potential_option_3 && <p>{item.potential_option_3}</p>}
                </div>
            </CardContent>
        </Card>
    );
};
