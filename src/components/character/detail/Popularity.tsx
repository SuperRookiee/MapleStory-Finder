import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PopularityProps {
    popularity?: number;
    loading?: boolean;
}

export const Popularity = ({ popularity, loading }: PopularityProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>인기도</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-20 mx-auto" />
                ) : (
                    <p className="text-2xl font-bold text-center">{popularity}</p>
                )}
            </CardContent>
        </Card>
    );
};

