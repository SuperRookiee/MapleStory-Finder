import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ICharacterSkill } from '@/interface/character/ICharacter';
import SkillDetail from './SkillDetail';

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

    const grades = skill.slice(0, 7); // 1~6차 전직 스킬
    const romans = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI'];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>스킬</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={romans[0]} className="w-full">
                    <TabsList className="grid !w-full grid-cols-7">
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
                                    <Popover key={s.skill_name}>
                                        <PopoverTrigger asChild>
                                            <div className="flex flex-col items-center text-center text-xs space-y-1 cursor-pointer">
                                                <Image
                                                    src={s.skill_icon}
                                                    alt={s.skill_name}
                                                    width={40}
                                                    height={40}
                                                />
                                                <span>{s.skill_name}</span>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 bg-transparent border-none shadow-none">
                                            <SkillDetail skill={s} />
                                        </PopoverContent>
                                    </Popover>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

