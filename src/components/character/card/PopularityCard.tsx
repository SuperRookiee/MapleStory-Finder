import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PopularityCard({ popularity }: { popularity: number }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>인기도</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-center">{popularity}</p>
            </CardContent>
        </Card>
    )
}