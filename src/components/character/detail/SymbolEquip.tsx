import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterSymbolEquipment } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface SymbolEquipProps {
    symbol?: ICharacterSymbolEquipment | null;
    loading?: boolean;
}

export const SymbolEquip = ({ symbol, loading }: SymbolEquipProps) => {
    const t = useTranslations();

    if (loading || !symbol) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.symbol.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.symbol.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    {symbol.symbol.map((s) => (
                        <div key={s.symbol_name} className="flex flex-col items-center text-center text-xs space-y-1">
                            <Image src={s.symbol_icon} alt={s.symbol_name} width={48} height={48} className='h-auto' />
                            <div>{s.symbol_name}</div>
                            <div className="text-[10px]">{s.symbol_force} ({s.symbol_level})</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default SymbolEquip;
