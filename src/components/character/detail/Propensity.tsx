import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
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

    const data = [
        { subject: '카리스마', value: propensity.charisma_level },
        { subject: '감성', value: propensity.sensibility_level },
        { subject: '통찰', value: propensity.insight_level },
        { subject: '의지', value: propensity.willingness_level },
        { subject: '손재주', value: propensity.handicraft_level },
        { subject: '매력', value: propensity.charm_level },
    ];

    const maxValue = Math.max(100, ...data.map((d) => d.value));

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>성향</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, maxValue]} />
                        <Radar
                            dataKey="value"
                            stroke="var(--chart-1)"
                            fill="var(--chart-1)"
                            fillOpacity={0.6}
                        />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default Propensity;
