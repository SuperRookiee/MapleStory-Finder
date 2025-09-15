export interface IGuildId {
    oguild_id: string;
}

export interface IGuildSkill {
    skill_name: string;
    skill_description: string;
    skill_level: number;
    skill_effect: string;
    skill_icon: string;
}

export interface IGuildBasic {
    date: string;
    world_name: string;
    guild_name: string;
    guild_level: number;
    guild_fame: number;
    guild_point: number;
    guild_master_name: string;
    guild_member_count: number;
    guild_member: string[];
    guild_skill: IGuildSkill[];
    guild_noblesse_skill: IGuildSkill[];
}
