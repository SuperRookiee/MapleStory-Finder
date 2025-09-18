import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterAndroidEquipment } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface AndroidProps {
    android?: ICharacterAndroidEquipment | null;
    loading?: boolean;
}

export const Android = ({ android, loading }: AndroidProps) => {
    const t = useTranslations();

    if (loading || !android) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.android.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-16 w-16" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.android.title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
                {android.android_icon && (
                    <Image src={android.android_icon} alt={android.android_name} width={64} height={64} className='h-auto'/>
                )}
                <div className="text-sm">
                    <p>{android.android_name}</p>
                    <p className="text-muted-foreground">
                        {t('character.detail.sections.android.grade', { grade: android.android_grade })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default Android;
