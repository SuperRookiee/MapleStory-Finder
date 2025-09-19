export interface StarforceEventInfo {
    success_rate?: string;
    destroy_decrease_rate?: string;
    cost_discount_rate?: string;
    plus_value?: string;
    starforce_event_range?: string;
}

export interface StarforceHistoryEntry {
    id: string;
    item_upgrade_result: string;
    before_starforce_count: number;
    after_starforce_count: number;
    starcatch_result?: string;
    superior_item_flag?: string;
    destroy_defence?: string;
    chance_time?: string;
    event_field_flag?: string;
    upgrade_item?: string;
    protect_shield?: string;
    bonus_stat_upgrade?: string;
    character_name: string;
    world_name: string;
    target_item: string;
    date_create: string;
    starforce_event_list?: StarforceEventInfo[];
}

export interface StarforceHistoryData {
    count: number;
    next_cursor?: string | null;
    starforce_history: StarforceHistoryEntry[];
}

export interface PotentialOption {
    value: string;
    grade?: string;
}

export interface PotentialHistoryEntry {
    id: string;
    character_name: string;
    date_create: string;
    potential_type: string;
    item_upgrade_result: string;
    miracle_time_flag?: string;
    item_equipment_part?: string;
    item_level?: number;
    target_item: string;
    potential_option_grade?: string;
    additional_potential_option_grade?: string;
    upgrade_guarantee: boolean;
    upgrade_guarantee_count: number;
    before_potential_option?: PotentialOption[];
    before_additional_potential_option?: PotentialOption[];
    after_potential_option?: PotentialOption[];
    after_additional_potential_option?: PotentialOption[];
}

export interface PotentialHistoryData {
    count: number;
    next_cursor?: string | null;
    potential_history: PotentialHistoryEntry[];
}

export interface CubeHistoryEntry {
    id: string;
    character_name: string;
    world_name?: string;
    date_create: string;
    cube_type: string;
    item_upgrade_result: string;
    miracle_time_flag?: string;
    item_equipment_part?: string;
    item_level?: number;
    target_item: string;
    potential_option_grade?: string;
    additional_potential_option_grade?: string;
    upgrade_guarantee: boolean;
    upgrade_guarantee_count: number;
    before_potential_option?: PotentialOption[];
    before_additional_potential_option?: PotentialOption[];
    after_potential_option?: PotentialOption[];
    after_additional_potential_option?: PotentialOption[];
}

export interface CubeHistoryData {
    count: number;
    next_cursor?: string | null;
    cube_history: CubeHistoryEntry[];
}
