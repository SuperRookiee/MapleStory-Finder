import Image from "next/image";
import { ICharacterSkill } from "@/interface/character/ICharacter";

interface SkillDetailProps {
    skill: ICharacterSkill["character_skill"][number];
}

const SkillDetail = ({ skill }: SkillDetailProps) => {
    return (
        <div className="bg-black/85 text-white rounded-lg shadow-lg p-4 max-w-xs">
            <div className="flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                        src={skill.skill_icon}
                        alt={skill.skill_name}
                        fill
                        className="object-contain"
                        sizes="40px"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-sm">{skill.skill_name}</h3>
                    <p className="text-xs">Lv. {skill.skill_level}</p>
                </div>
            </div>
            {skill.skill_description && (
                <p className="text-xs mb-1 whitespace-pre-line">
                    {skill.skill_description}
                </p>
            )}
            {skill.skill_effect && (
                <p className="text-xs whitespace-pre-line">
                    {skill.skill_effect}
                </p>
            )}
        </div>
    );
};

export default SkillDetail;

