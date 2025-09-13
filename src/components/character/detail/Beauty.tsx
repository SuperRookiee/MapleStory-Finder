import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterBeautyEquipment } from '@/interface/character/ICharacter';

interface BeautyProps {
    beauty?: ICharacterBeautyEquipment | null;
    loading?: boolean;
}

export const Beauty = ({ beauty, loading }: BeautyProps) => {
    if (loading || !beauty) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>외형</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full" />
                </CardContent>
            </Card>
        );
    }

    const { character_hair, character_face, character_skin } = beauty;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>외형</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p>헤어: {character_hair.hair_name}</p>
                <p>얼굴: {character_face.face_name}</p>
                <p>피부: {character_skin.skin_name}</p>
            </CardContent>
        </Card>
    );
};

export default Beauty;
