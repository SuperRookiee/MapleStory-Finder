import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ICharacterStat } from "@/interface/character"

export function StatCard({ stat }: { stat: ICharacterStat }) {
    const highlights = ["전투력", "보스 몬스터 데미지", "크리티컬 확률", "크리티컬 데미지"]

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{stat.character_class} 스탯</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>스탯</TableHead>
                            <TableHead className="text-right">값</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stat.final_stat.map((s) => (
                            <TableRow key={s.stat_name}>
                                <TableCell>
                                    {highlights.includes(s.stat_name) ? (
                                        <Badge variant="secondary">{s.stat_name}</Badge>
                                    ) : (
                                        s.stat_name
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium">{s.stat_value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
