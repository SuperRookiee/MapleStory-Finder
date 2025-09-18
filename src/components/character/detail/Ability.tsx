import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ICharacterAbility } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

const gradeStyles: Record<string, string> = {
    "레전드리": 'bg-green-500 dark:bg-green-600 text-white',
    "유니크": 'bg-yellow-300 dark:bg-yellow-500 text-white',
    "에픽": 'bg-violet-500 dark:bg-violet-600 text-white',
    "레어": 'bg-blue-500 dark:bg-blue-600 text-white',
};

interface AbilityProps {
    ability?: ICharacterAbility | null;
    loading?: boolean;
}

export const Ability = ({ ability, loading }: AbilityProps) => {
    const t = useTranslations();

    if (loading || !ability) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.ability.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    const presets = [
        {
            key: "1",
            label: t('character.detail.common.preset', { number: 1 }),
            data: ability.ability_preset_1,
        },
        {
            key: "2",
            label: t('character.detail.common.preset', { number: 2 }),
            data: ability.ability_preset_2,
        },
        {
            key: "3",
            label: t('character.detail.common.preset', { number: 3 }),
            data: ability.ability_preset_3,
        },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.ability.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={String(ability.preset_no)}>
                    <TabsList className="grid !w-full grid-cols-3">
                        {presets.map((p) => (
                            <TabsTrigger key={p.key} value={p.key}>
                                {p.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {presets.map((p) => (
                        <TabsContent key={p.key} value={p.key} className="space-y-2 pt-2">
                            {p.data?.ability_info.map((a) => (
                                <div
                                    key={a.ability_no}
                                    className={`rounded px-2 py-1 text-center font-medium ${gradeStyles[a.ability_grade] || ''}`}
                                >
                                    {a.ability_value}
                                </div>
                            ))}
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default Ability;