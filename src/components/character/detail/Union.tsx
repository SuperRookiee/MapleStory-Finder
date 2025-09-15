import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IUnion, IUnionArtifact, IUnionRaider } from '@/interface/union/IUnion';

interface UnionProps {
    union?: IUnion | null;
    raider?: IUnionRaider | null;
    artifact?: IUnionArtifact | null;
    loading?: boolean;
}

export const Union = ({ union, raider, artifact, loading }: UnionProps) => {
    if (loading || !union || !raider || !artifact) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>유니온</CardTitle>
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
                <CardTitle>유니온</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <dl className="grid grid-cols-[auto,1fr] gap-2">
                    <dt className="font-medium">레벨</dt>
                    <dd>{union.union_level}</dd>
                    <dt className="font-medium">등급</dt>
                    <dd>{union.union_grade}</dd>
                    <dt className="font-medium">아티팩트 레벨</dt>
                    <dd>{union.union_artifact_level}</dd>
                </dl>
                {raider.union_raider_stat.length > 0 && (
                    <div>
                        <div className="mb-1 font-medium">공격대원 효과</div>
                        <ul className="list-disc space-y-1 pl-5">
                            {raider.union_raider_stat.map((s, idx) => (
                                <li key={`${s}-${idx}`}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {artifact.union_artifact_effect.length > 0 && (
                    <div>
                        <div className="mb-1 font-medium">아티팩트 효과</div>
                        <ul className="list-disc space-y-1 pl-5">
                            {artifact.union_artifact_effect.map((e, idx) => (
                                <li key={`${e.name}-${e.level}-${idx}`}>
                                    {e.name} Lv.{e.level}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Union;
