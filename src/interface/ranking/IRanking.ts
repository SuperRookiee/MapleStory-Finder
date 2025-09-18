export interface IRankingCharacterBase {
    date: string;
    ranking: number;
    character_name: string;
    world_name: string;
    class_name: string;
    sub_class_name: string;
}

export interface IOverallRanking extends IRankingCharacterBase {
    character_level: number;
    character_exp: number;
    character_popularity: number;
    character_guildname: string;
}

export interface IUnionRanking extends IRankingCharacterBase {
    union_level: number;
    union_power: number;
}

export interface IDojangRanking extends IRankingCharacterBase {
    character_level: number;
    dojang_floor: number;
    dojang_time_record: number;
}

export interface ITheSeedRanking extends IRankingCharacterBase {
    character_level: number;
    theseed_floor: number;
    theseed_time_record: number;
}

export interface IAchievementRanking extends IRankingCharacterBase {
    trophy_grade: string;
    trophy_score: number;
}

export interface IGuildRanking {
    date: string;
    ranking: number;
    guild_name: string;
    world_name: string;
    guild_level: number;
    guild_master_name: string;
    guild_mark: string;
    guild_point: number;
}
