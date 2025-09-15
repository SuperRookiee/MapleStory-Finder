import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterAbility } from '@/interface/character/ICharacter';

const gradeStyles: Record<string, string> = {
    레전드리:
        'bg-green-500 text-green-950 dark:bg-green-600 dark:text-green-50',
    유니크:
        'bg-yellow-300 text-yellow-950 dark:bg-yellow-500 dark:text-yellow-950',
    에픽: 'bg-violet-500 text-violet-50 dark:bg-violet-600 dark:text-violet-50',
    레어: 'bg-blue-500 text-blue-50 dark:bg-blue-600 dark:text-blue-50',
};

interface AbilityProps {
    ability?: ICharacterAbility | null;
    loading?: boolean;
}

export const Ability = ({ ability, loading }: AbilityProps) => {
    if (loading || !ability) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>어빌리티</CardTitle>
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
                <CardTitle>어빌리티</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                {ability.ability_info.map((a) => (
                    <div
                        key={a.ability_no}
                        className={`rounded px-2 py-1 text-center font-medium ${gradeStyles[a.ability_grade] || ''}`}
                    >
                        {a.ability_value}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default Ability;
