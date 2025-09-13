import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterAbility } from '@/interface/character/ICharacter';

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
            <CardContent className="text-sm space-y-1">
                {ability.ability_info.map((a) => (
                    <p key={a.ability_no}>{a.ability_value}</p>
                ))}
            </CardContent>
        </Card>
    );
};

export default Ability;
