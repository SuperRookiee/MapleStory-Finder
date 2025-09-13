import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterOtherStat } from '@/interface/character/ICharacter';

interface OtherStatProps {
    otherStat?: ICharacterOtherStat | null;
    loading?: boolean;
}

export const OtherStat = ({ otherStat, loading }: OtherStatProps) => {
    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>기타 스탯</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!otherStat || !otherStat.other_stat) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>기타 스탯</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <p>정보가 없습니다.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>기타 스탯</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                {otherStat.other_stat.map((group) => (
                    <div key={group.other_stat_type}>
                        <p className="font-semibold">{group.other_stat_type}</p>
                        {group.stat_info.map((s) => (
                            <p key={s.stat_name} className="text-xs">
                                {s.stat_name}: {s.stat_value}
                            </p>
                        ))}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default OtherStat;
