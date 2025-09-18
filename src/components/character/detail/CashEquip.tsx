import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterCashItemEquipment } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface CashEquipProps {
    equip?: ICharacterCashItemEquipment | null;
    loading?: boolean;
}

export const CashEquip = ({ equip, loading }: CashEquipProps) => {
    const t = useTranslations();

    if (loading || !equip) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.cash.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const items = equip.cash_item_equipment_base;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.cash.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div key={item.cash_item_equipment_slot} className="flex flex-col items-center text-center text-xs space-y-1">
                            <Image src={item.cash_item_icon} alt={item.cash_item_name} width={40} height={40} className='h-auto'/>
                            <span>{item.cash_item_name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

