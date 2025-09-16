import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterPropensity } from '@/interface/character/ICharacter';

interface PropensityProps {
    propensity?: ICharacterPropensity | null;
    loading?: boolean;
}

// Tooltip props type 안전하게 정의
interface CustomTooltipProps {
    active?: boolean;
    label?: NameType;
    payload?: {
        value: ValueType;
        name: NameType;
        color: string;
    }[];
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

    // 커스텀 툴팁
    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length > 0) {
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm w-20">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    {payload.map((entry, index) =>
                        <p key={index} className="text-sm text-muted-foreground">
                            {entry.value}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

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
                        <Radar
                            dataKey="value"
                            stroke="var(--chart-1)"
                            fill="var(--chart-1)"
                            fillOpacity={0.7}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default Propensity;