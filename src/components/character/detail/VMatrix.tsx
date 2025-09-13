import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterVMatrix } from '@/interface/character/ICharacter';

interface VMatrixProps {
    vMatrix?: ICharacterVMatrix | null;
    loading?: boolean;
}

export const VMatrix = ({ vMatrix, loading }: VMatrixProps) => {
    if (loading || !vMatrix) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>V 매트릭스</CardTitle>
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
                <CardTitle>V 매트릭스</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    {vMatrix.character_v_core_equipment.map((core) => (
                        <div key={core.v_core_name} className="flex justify-between">
                            <span>{core.v_core_name}</span>
                            <span className="text-muted-foreground">Lv.{core.v_core_level}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default VMatrix;
