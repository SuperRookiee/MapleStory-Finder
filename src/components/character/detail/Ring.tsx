import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IRingExchangeSkillEquipment } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface RingProps {
    ring?: IRingExchangeSkillEquipment | null;
    loading?: boolean;
}

export const Ring = ({ ring, loading }: RingProps) => {
    const t = useTranslations();

    if (loading || !ring) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.ring.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.ring.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{ring.special_ring_exchange_name}</p>
                <p className="text-sm">
                    {t('common.level', { value: ring.special_ring_exchange_level })}
                </p>
            </CardContent>
        </Card>
    );
};

export default Ring;
