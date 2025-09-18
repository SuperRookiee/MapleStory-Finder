import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterSetEffect } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

interface SetEffectProps {
    setEffect?: ICharacterSetEffect | null;
    loading?: boolean;
}

export const SetEffect = ({ setEffect, loading }: SetEffectProps) => {
    const t = useTranslations();

    if (loading || !setEffect) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.setEffect.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.setEffect.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {setEffect.set_effect.map((set) => (
                        <div key={set.set_name} className="space-y-1 text-sm">
                            <p className="font-semibold">{set.set_name}</p>
                            {set.set_effect_info.map((info) => (
                                <p key={info.set_count} className="text-xs">
                                    {t('character.detail.sections.setEffect.entry', {
                                        count: info.set_count,
                                        option: info.set_option,
                                    })}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default SetEffect;
