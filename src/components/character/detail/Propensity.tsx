import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterPropensity } from '@/interface/character/ICharacter';

interface PropensityProps {
    propensity?: ICharacterPropensity | null;
    loading?: boolean;
}

export const Propensity = ({ propensity, loading }: PropensityProps) => {
    if (loading || !propensity) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>성향</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    const entries = [
        ['카리스마', propensity.charisma_level],
        ['감성', propensity.sensibility_level],
        ['통찰', propensity.insight_level],
        ['의지', propensity.willingness_level],
        ['손재주', propensity.handicraft_level],
        ['매력', propensity.charm_level],
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>성향</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
                {entries.map(([name, value]) => (
                    <p key={name}>{name}: {value}</p>
                ))}
            </CardContent>
        </Card>
    );
};

export default Propensity;
