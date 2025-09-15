import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
            <CardContent className="space-y-2 text-sm">
                <div>레벨: {union.union_level}</div>
                <div>등급: {union.union_grade}</div>
                <div>아티팩트 레벨: {union.union_artifact_level}</div>
                {raider.union_raider_stat.length > 0 && (
                    <div>
                        <div className="font-medium">공격대원 효과</div>
                        <ul className="list-disc pl-5">
                            {raider.union_raider_stat.map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {artifact.union_artifact_effect.length > 0 && (
                    <div>
                        <div className="font-medium">아티팩트 효과</div>
                        <ul className="list-disc pl-5">
                            {artifact.union_artifact_effect.map((e) => (
                                <li key={e.name}>{e.name} Lv.{e.level}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Union;
