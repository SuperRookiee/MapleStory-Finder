/* -------------------- 기본 정보 -------------------- */
export interface ICharacterBasic {
    date: string;
    character_name: string;
    world_name: string;
    character_gender: string;
    character_class: string;
    character_class_level: string;
    character_level: number;
    character_exp: number;
    character_exp_rate: string;
    character_guild_name: string;
    character_image: string;
    character_date_create: string;
    access_flag: string;
    liberation_quest_clear_flag: string;
    liberation_quest_clear: string;
}

export interface ICharacterStat {
    date: string
    character_class: string
    final_stat: { stat_name: string; stat_value: string }[]
    remain_ap: number
}

export interface ICharacterPopularity {
    date: string
    popularity: number
}

export interface IHyperStatInfo {
    stat_type: string
    stat_point: number
    stat_level: number
    stat_increase: string
}

export interface ICharacterHyperStat {
    date: string
    character_class: string
    use_preset_no: string
    use_available_hyper_stat: number
    hyper_stat_preset_1: IHyperStatInfo[]
    hyper_stat_preset_1_remain_point: number
    hyper_stat_preset_2: IHyperStatInfo[]
    hyper_stat_preset_2_remain_point: number
    hyper_stat_preset_3: IHyperStatInfo[]
    hyper_stat_preset_3_remain_point: number
}

/* -------------------- 장비 / 스킬 -------------------- */
export interface ICharacterItemEquipment {
    date: string
    character_gender: string
    character_class: string
    preset_no: number
    item_equipment: IItemEquipment[]
    item_equipment_preset_1: IItemEquipment[]
    item_equipment_preset_2: IItemEquipment[]
    item_equipment_preset_3: IItemEquipment[]
}

export interface IItemEquipment {
    equipment_level_increase: string;
    item_equipment_part: string;
    item_equipment_slot: string;
    item_name: string;
    item_icon: string;

    // 스타포스 / 등급
    starforce?: string;
    potential_option_grade?: string | null;
    additional_potential_option_grade?: string | null;

    // 기본 잠재
    potential_option_1?: string | null;
    potential_option_2?: string | null;
    potential_option_3?: string | null;

    // 에디셔널 잠재
    additional_potential_option_1?: string | null;
    additional_potential_option_2?: string | null;
    additional_potential_option_3?: string | null;

    // 익셉셔널 잠재
    item_exceptional_option?: {
        str?: string;
        dex?: string;
        int?: string;
        luk?: string;
        attack_power?: string;
        magic_power?: string;
    };

    // 총합 옵션
    item_total_option?: {
        str?: string;
        dex?: string;
        int?: string;
        luk?: string;
        all_stat?: string;
        max_hp?: string;
        max_mp?: string
        attack_power?: string;
        magic_power?: string;
        boss_damage?: string;
        ignore_monster_armor?: string;
        armor?: string;
        damage?: string;
    };

    // 기본 옵션
    item_base_option?: {
        str?: string;
        dex?: string;
        int?: string;
        luk?: string;
        max_hp?: string;
        max_mp?: string;
        attack_power?: string;
        magic_power?: string;
        armor?: string;
        speed?: string;
        jump?: string;
    };

    // 추가 옵션 (잠재/에디셔널이 아닌 장비 추가 능력치)
    item_add_option?: {
        str?: string;
        dex?: string;
        int?: string;
        luk?: string;
        max_hp?: string;
        max_mp?: string;
        attack_power?: string;
        magic_power?: string;
        armor?: string;
        speed?: string;
        jump?: string;
        all_stat?: string;
        damage?: string;
    };

    // 기타 옵션 (주문서 강화 등)
    item_etc_option?: {
        str?: string;
        dex?: string;
        int?: string;
        luk?: string;
        max_hp?: string;
        max_mp?: string;
        attack_power?: string;
        magic_power?: string;
        armor?: string;
        speed?: string;
        jump?: string;
    };

    // 스타포스 옵션
    item_starforce_option?: {
        str?: string;
        dex?: string;
        int?: string;
        luk?: string;
        max_hp?: string;
        max_mp?: string;
        attack_power?: string;
        magic_power?: string;
        armor?: string;
        speed?: string;
        jump?: string;
    };

    // 기타 기본 정보
    item_description: string | null;
    item_shape_name: string;
    item_shape_icon: string;
    item_gender: string | null;
}

export interface ICharacterCashItemEquipment {
    date: string
    character_gender: string
    character_class: string
    character_look_mode: string
    preset_no: number
    cash_item_equipment_base: ICashItem[]
    cash_item_equipment_preset_1: ICashItem[]
    cash_item_equipment_preset_2: ICashItem[]
    cash_item_equipment_preset_3: ICashItem[]
}

export interface ICashItem {
    cash_item_equipment_part: string
    cash_item_equipment_slot: string
    cash_item_name: string
    cash_item_icon: string
    cash_item_description: string
    // ... (option, expire 등 필요시 확장)
}

export interface ICharacterSymbolEquipment {
    date: string
    character_class: string
    symbol: {
        symbol_name: string
        symbol_icon: string
        symbol_description: string
        symbol_force: string
        symbol_level: number
        symbol_str: string
        symbol_dex: string
        symbol_int: string
        symbol_luk: string
        symbol_hp: string
        symbol_growth_count: number
        symbol_require_growth_count: number
    }[]
}

export interface ICharacterSetEffect {
    date: string
    set_effect: {
        set_name: string
        total_set_count: number
        set_effect_info: { set_count: number; set_option: string }[]
        set_option_full: { set_count: number; set_option: string }[]
    }[]
}

export interface ICharacterSkill {
    date: string
    character_class: string
    character_skill: {
        skill_name: string
        skill_description: string
        skill_level: number
        skill_effect: string
        skill_icon: string
    }[]
}

export interface ICharacterLinkSkill {
    date: string
    character_class: string
    character_link_skill: {
        skill_name: string
        skill_description: string
        skill_level: number
        skill_effect: string
        skill_icon: string
    }[]
}

/* -------------------- 심화 -------------------- */
export interface ICharacterVMatrix {
    date: string
    character_class: string
    character_v_core_equipment: {
        slot_id: string
        slot_level: number
        v_core_name: string
        v_core_type: string
        v_core_level: number
        v_core_skill_1: string
        v_core_skill_2?: string
        v_core_skill_3?: string
    }[]
    character_v_matrix_remain_slot_upgrade_point: number
}

export interface ICharacterHexaMatrix {
    date: string
    character_hexa_core_equipment: {
        hexa_core_name: string
        hexa_core_level: number
        hexa_core_type: string
        linked_skill: { hexa_skill_id: string }[]
    }[]
}

export interface ICharacterHexaMatrixStat {
    date: string
    character_class: string
    character_hexa_stat_core: IHexaStatCore[]
    character_hexa_stat_core_2: IHexaStatCore[]
    character_hexa_stat_core_3: IHexaStatCore[]
}

export interface IHexaStatCore {
    slot_id: string
    main_stat_name: string
    sub_stat_name_1: string
    sub_stat_name_2: string
    main_stat_level: number
    sub_stat_level_1: number
    sub_stat_level_2: number
    stat_grade: number
}

export interface ICharacterDojang {
    date: string
    character_class: string
    world_name: string
    dojang_best_floor: number
    date_dojang_record: string
    dojang_best_time: number
}

export interface IRingExchangeSkillEquipment {
    date: string
    character_class: string
    special_ring_exchange_name: string
    special_ring_exchange_level: number
}

export interface ICharacterOtherStat {
    date: string
    other_stat: {
        other_stat_type: string
        stat_info: { stat_name: string; stat_value: string }[]
    }[] | null
}

/* -------------------- 꾸미기 / 기타 -------------------- */
export interface ICharacterBeautyEquipment {
    date: string
    character_gender: string
    character_class: string
    character_hair: {
        hair_name: string
        base_color: string
        mix_color: string
        mix_rate: string
    }
    character_face: {
        face_name: string
        base_color: string
        mix_color: string
        mix_rate: string
    }
    character_skin: {
        skin_name: string
        color_style: string
        hue: number
        saturation: number
        brightness: number
    }
}

export interface ICharacterAndroidEquipment {
    date: string
    android_name: string
    android_icon: string
    android_description: string
    android_gender: string
    android_grade: string
    android_skin?: { skin_name: string; color_style: string }
}

export interface ICharacterPetEquipment {
    date: string
    pet_1_name: string
    pet_1_icon: string
    pet_1_description: string
    // ... (펫2, 펫3도 동일 구조)
}

export interface ICharacterPropensity {
    date: string
    charisma_level: number
    sensibility_level: number
    insight_level: number
    willingness_level: number
    handicraft_level: number
    charm_level: number
}

export interface ICharacterAbility {
    date: string
    ability_preset_no: number
    ability_info: {
        ability_no: number
        ability_grade: string
        ability_value: string
    }[]
}
