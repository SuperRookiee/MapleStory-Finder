import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterVMatrix } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface VMatrixProps {
    vMatrix?: ICharacterVMatrix | null;
    loading?: boolean;
}

export const VMatrix = ({ vMatrix, loading }: VMatrixProps) => {
    const t = useTranslations();

    if (loading || !vMatrix) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.vMatrix.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full"/>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.vMatrix.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    {vMatrix.character_v_core_equipment.map((core, idx) => (
                        <div key={`${core.v_core_name}-${idx}`} className="flex justify-between">
                            <span>{core.v_core_name}</span>
                            <span className="text-muted-foreground">
                                {t('common.level', { value: core.v_core_level })}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default VMatrix;
