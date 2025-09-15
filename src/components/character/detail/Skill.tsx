import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

    const grades = skill.slice(1, 7); // 1~6차 전직 스킬
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI'];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>스킬</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={romans[0]} className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                        {grades.map((_, i) => (
                            <TabsTrigger key={romans[i]} value={romans[i]}>
                                {romans[i]}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {grades.map((g, i) => (
                        <TabsContent key={romans[i]} value={romans[i]}>
                            <div className="grid grid-cols-4 gap-4">
                                {g?.character_skill.map((s) => (
                                    <div
                                        key={s.skill_name}
                                        className="flex flex-col items-center text-center text-xs space-y-1"
                                    >
                                        <Image
                                            src={s.skill_icon}
                                            alt={s.skill_name}
                                            width={40}
                                            height={40}
                                        />
                                        <span>{s.skill_name}</span>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

