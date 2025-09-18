import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterBeautyEquipment } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface BeautyProps {
    beauty?: ICharacterBeautyEquipment | null;
    loading?: boolean;
}

export const Beauty = ({ beauty, loading }: BeautyProps) => {
    const t = useTranslations();

    if (loading || !beauty) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.beauty.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    const { character_hair, character_face, character_skin } = beauty;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.beauty.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p>
                    {t('character.detail.sections.beauty.hair')}: {character_hair.hair_name}
                </p>
                <p>
                    {t('character.detail.sections.beauty.face')}: {character_face.face_name}
                </p>
                <p>
                    {t('character.detail.sections.beauty.skin')}: {character_skin.skin_name}
                </p>
            </CardContent>
        </Card>
    );
};

export default Beauty;
