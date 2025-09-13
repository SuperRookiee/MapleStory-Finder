import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterHexaMatrix } from '@/interface/character/ICharacter';

interface HexaMatrixProps {
    hexaMatrix?: ICharacterHexaMatrix | null;
    loading?: boolean;
}

export const HexaMatrix = ({ hexaMatrix, loading }: HexaMatrixProps) => {
    if (loading || !hexaMatrix) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>헥사 매트릭스</CardTitle>
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
                <CardTitle>헥사 매트릭스</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    {hexaMatrix.character_hexa_core_equipment.map((core) => (
                        <div key={core.hexa_core_name} className="flex justify-between">
                            <span>{core.hexa_core_name}</span>
                            <span className="text-muted-foreground">Lv.{core.hexa_core_level}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default HexaMatrix;
