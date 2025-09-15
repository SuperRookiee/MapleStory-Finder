export interface IUnion {
    date: string;
    union_level: number;
    union_grade: string;
    union_artifact_level: number;
    union_artifact_exp: number;
    union_artifact_point: number;
}

export interface IUnionRaiderInnerStat {
    stat_field_id: string;
    stat_field_effect: string;
}

export interface IUnionRaiderBlock {
    block_type: string;
    block_class: string;
    block_level: string;
    block_control_point: { x: number; y: number };
    block_position: { x: number; y: number }[];
}

export interface IUnionRaiderPreset {
    union_raider_stat: string[];
    union_occupied_stat: string[];
    union_inner_stat: IUnionRaiderInnerStat[];
    union_block: IUnionRaiderBlock[];
}

export interface IUnionRaider extends IUnionRaiderPreset {
    date: string;
    use_preset_no: number;
    union_raider_preset_1: IUnionRaiderPreset;
    union_raider_preset_2: IUnionRaiderPreset;
    union_raider_preset_3: IUnionRaiderPreset;
    union_raider_preset_4: IUnionRaiderPreset;
    union_raider_preset_5: IUnionRaiderPreset;
}

export interface IUnionArtifactEffect {
    name: string;
    level: number;
}

export interface IUnionArtifactCrystal {
    name: string;
    validity_flag: string;
    date_expire: string | null;
    level: number;
    crystal_option_name_1: string;
    crystal_option_name_2: string;
    crystal_option_name_3: string;
}

export interface IUnionArtifact {
    date: string;
    union_artifact_effect: IUnionArtifactEffect[];
    union_artifact_crystal: IUnionArtifactCrystal[];
    union_artifact_remain_ap: number;
}

export interface IUnionChampionBadgeInfo {
    stat: string;
}

export interface IUnionChampionInfo {
    champion_name: string;
    champion_slot: number;
    champion_grade: string;
    champion_class: string;
    champion_badge_info: IUnionChampionBadgeInfo[];
}

export interface IUnionChampion {
    date: string;
    union_champion: IUnionChampionInfo[];
    champion_badge_total_info: IUnionChampionBadgeInfo[];
}
