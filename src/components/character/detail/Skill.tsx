import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterSkill } from '@/interface/character/ICharacter';

interface SkillProps {
    skill?: ICharacterSkill[] | null;
    loading?: boolean;
}

export const Skill = ({ skill, loading }: SkillProps) => {
    if (loading || !skill) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>스킬</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const skills = skill.flatMap((s) => s.character_skill);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>스킬</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4">
                    {skills.map((s) => (
                        <div key={s.skill_name} className="flex flex-col items-center text-center text-xs space-y-1">
                            <Image src={s.skill_icon} alt={s.skill_name} width={40} height={40} />
                            <span>{s.skill_name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

