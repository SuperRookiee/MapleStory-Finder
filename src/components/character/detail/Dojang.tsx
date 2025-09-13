import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterDojang } from '@/interface/character/ICharacter';

interface DojangProps {
    dojang?: ICharacterDojang | null;
    loading?: boolean;
}

export const Dojang = ({ dojang, loading }: DojangProps) => {
    if (loading || !dojang) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>무릉도장</CardTitle>
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
                <CardTitle>무릉도장</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">최고 층수: {dojang.dojang_best_floor}층</p>
                <p className="text-sm">기록: {dojang.dojang_best_time}초</p>
            </CardContent>
        </Card>
    );
};

export default Dojang;
