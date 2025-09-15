import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICharacterHyperStat } from "@/interface/character/ICharacter";

interface HyperStatProps {
    hyper?: ICharacterHyperStat | null;
    loading?: boolean;
}

export const HyperStat = ({ hyper, loading }: HyperStatProps) => {
    console.log(hyper)
    if (loading || !hyper) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>하이퍼 스탯</CardTitle>
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="grid w-full grid-cols-3 gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>
                    <ul className="mt-4 space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i} className="flex justify-between text-sm">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        );
    }

    const presets = [
        { key: "1", label: "프리셋 1", stats: hyper.hyper_stat_preset_1 },
        { key: "2", label: "프리셋 2", stats: hyper.hyper_stat_preset_2 },
        { key: "3", label: "프리셋 3", stats: hyper.hyper_stat_preset_3 },
    ];

    return (
        <Card className="w-full">
            <CardHeader className="space-y-1">
                <CardTitle>하이퍼 스탯</CardTitle>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    사용 가능 포인트: {hyper.use_available_hyper_stat}
                </p>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={hyper.use_preset_no}>
                    <TabsList className="grid w-full grid-cols-3">
                        {presets.map((p) => (
                            <TabsTrigger key={p.key} value={p.key}>
                                {p.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {presets.map((p) => (
                        <TabsContent key={p.key} value={p.key} className="px-2">
                            <ul className="space-y-2">
                                {p.stats
                                    .filter((s) => s.stat_level > 0)
                                    .map((s) => (
                                        <li key={s.stat_type} className="flex justify-between text-sm">
                                            <span>{s.stat_type}</span>
                                            <span className="font-medium">
                                                {s.stat_increase.match(/\d+%?/)?.[0] ?? ""}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

