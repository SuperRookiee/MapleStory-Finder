import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICharacterHyperStat } from "@/interface/ICharacter";

export function HyperStat({ hyper }: { hyper: ICharacterHyperStat }) {
    const presets = [
        { key: "1", label: "프리셋 1", stats: hyper.hyper_stat_preset_1 },
        { key: "2", label: "프리셋 2", stats: hyper.hyper_stat_preset_2 },
        { key: "3", label: "프리셋 3", stats: hyper.hyper_stat_preset_3 },
    ]

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>하이퍼 스탯</CardTitle>
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
                        <TabsContent key={p.key} value={p.key}>
                            <ul className="space-y-2">
                                {p.stats
                                    .filter((s) => s.stat_level > 0)
                                    .map((s) => (
                                        <li key={s.stat_type} className="flex justify-between text-sm">
                                            <span>{s.stat_type}</span>
                                            <span className="font-medium">{s.stat_increase}</span>
                                        </li>
                                    ))}
                            </ul>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}
