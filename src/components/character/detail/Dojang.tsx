import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterDojang } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface DojangProps {
    dojang?: ICharacterDojang | null;
    loading?: boolean;
}

export const Dojang = ({ dojang, loading }: DojangProps) => {
    const t = useTranslations();

    if (loading || !dojang) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.dojang.title')}</CardTitle>
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
                <CardTitle>{t('character.detail.sections.dojang.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">
                    {t('character.detail.sections.dojang.bestFloor', {
                        floor: dojang.dojang_best_floor,
                    })}
                </p>
                <p className="text-sm">
                    {t('character.detail.sections.dojang.bestTime', {
                        time: dojang.dojang_best_time,
                    })}
                </p>
            </CardContent>
        </Card>
    );
};

export default Dojang;
