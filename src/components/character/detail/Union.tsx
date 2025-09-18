import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IUnion, IUnionArtifact, IUnionRaider } from '@/interface/union/IUnion';
import { useTranslations } from '@/providers/LanguageProvider';

interface UnionProps {
    union?: IUnion | null;
    raider?: IUnionRaider | null;
    artifact?: IUnionArtifact | null;
    loading?: boolean;
}

export const Union = ({ union, raider, artifact, loading }: UnionProps) => {
    const t = useTranslations();

    if (loading || !union || !raider || !artifact) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('character.detail.sections.union.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('character.detail.sections.union.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <dl className="grid grid-cols-[auto,1fr] gap-2">
                    <dt className="font-medium">{t('character.detail.sections.union.level')}</dt>
                    <dd>{union.union_level}</dd>
                    <dt className="font-medium">{t('character.detail.sections.union.grade')}</dt>
                    <dd>{union.union_grade}</dd>
                    <dt className="font-medium">{t('character.detail.sections.union.artifactLevel')}</dt>
                    <dd>{union.union_artifact_level}</dd>
                </dl>
                {raider.union_raider_stat.length > 0 && (
                    <div>
                        <div className="mb-1 font-medium">{t('character.detail.sections.union.raiderEffects')}</div>
                        <ul className="list-disc space-y-1 pl-5">
                            {raider.union_raider_stat.map((s, idx) => (
                                <li key={`${s}-${idx}`}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {artifact.union_artifact_effect.length > 0 && (
                    <div>
                        <div className="mb-1 font-medium">{t('character.detail.sections.union.artifactEffects')}</div>
                        <ul className="list-disc space-y-1 pl-5">
                            {artifact.union_artifact_effect.map((e, idx) => (
                                <li key={`${e.name}-${e.level}-${idx}`}>
                                    {e.name} {t('common.level', { value: e.level })}
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
