import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ICharacterLinkSkill } from '@/interface/character/ICharacter';

interface LinkSkillProps {
    linkSkill?: ICharacterLinkSkill | null;
    loading?: boolean;
}

export const LinkSkill = ({ linkSkill, loading }: LinkSkillProps) => {
    if (loading || !linkSkill) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>링크 스킬</CardTitle>
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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>링크 스킬</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4">
                    {linkSkill.character_link_skill.map((s, idx) => (
                        <div key={`${s.skill_name}-${idx}`} className="flex flex-col items-center text-center text-xs space-y-1">
                            <Image src={s.skill_icon} alt={s.skill_name} width={40} height={40} />
                            <span>{s.skill_name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default LinkSkill;
