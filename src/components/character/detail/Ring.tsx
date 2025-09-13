import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IRingExchangeSkillEquipment } from '@/interface/character/ICharacter';

interface RingProps {
    ring?: IRingExchangeSkillEquipment | null;
    loading?: boolean;
}

export const Ring = ({ ring, loading }: RingProps) => {
    if (loading || !ring) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>스페셜 링</CardTitle>
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
                <CardTitle>스페셜 링</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{ring.special_ring_exchange_name}</p>
                <p className="text-sm">Lv.{ring.special_ring_exchange_level}</p>
            </CardContent>
        </Card>
    );
};

export default Ring;
