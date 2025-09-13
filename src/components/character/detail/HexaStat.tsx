import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterHexaMatrixStat, IHexaStatCore } from '@/interface/character/ICharacter';

interface HexaStatProps {
    hexaStat?: ICharacterHexaMatrixStat | null;
    loading?: boolean;
}

export const HexaStat = ({ hexaStat, loading }: HexaStatProps) => {
    if (loading || !hexaStat) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>헥사 스탯</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    const cores: IHexaStatCore[] = [
        ...hexaStat.character_hexa_stat_core,
        ...hexaStat.character_hexa_stat_core_2,
        ...hexaStat.character_hexa_stat_core_3,
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>헥사 스탯</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {cores.map((core) => (
                    <div key={core.slot_id} className="flex justify-between">
                        <span className="font-medium">
                            {core.main_stat_name} Lv.{core.main_stat_level}
                        </span>
                        <span>
                            {core.sub_stat_name_1} Lv.{core.sub_stat_level_1} / {core.sub_stat_name_2} Lv.{core.sub_stat_level_2}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

