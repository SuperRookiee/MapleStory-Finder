import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterPropensity } from '@/interface/character/ICharacter';
import { useTranslations } from '@/providers/LanguageProvider';

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
    const t = useTranslations();

    if (loading || !propensity) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.propensity.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    const data = [
        { key: 'charisma', value: propensity.charisma_level },
        { key: 'empathy', value: propensity.sensibility_level },
        { key: 'insight', value: propensity.insight_level },
        { key: 'willpower', value: propensity.willingness_level },
        { key: 'diligence', value: propensity.handicraft_level },
        { key: 'charm', value: propensity.charm_level },
    ].map((item) => ({
        subject: t(`character.detail.sections.propensity.labels.${item.key}`),
        value: item.value,
    }));

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
                    <CardTitle>{t('character.detail.sections.propensity.title')}</CardTitle>
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