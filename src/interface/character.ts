/* -------------------- Stage1 -------------------- */
export interface CharacterStat {
    date: string
    character_class: string
    final_stat: { stat_name: string; stat_value: string }[]
    remain_ap: number
}

export interface CharacterPopularity {
    date: string
    popularity: number
}

export interface HyperStatInfo {
    stat_type: string
    stat_point: number
    stat_level: number
    stat_increase: string
}

export interface CharacterHyperStat {
    date: string
    character_class: string
    use_preset_no: string
    use_available_hyper_stat: number
    hyper_stat_preset_1: HyperStatInfo[]
    hyper_stat_preset_1_remain_point: number
    hyper_stat_preset_2: HyperStatInfo[]
    hyper_stat_preset_2_remain_point: number
    hyper_stat_preset_3: HyperStatInfo[]
    hyper_stat_preset_3_remain_point: number
}

export interface Stage1Data {
    stat?: CharacterStat
    popularity?: CharacterPopularity
    hyper?: CharacterHyperStat
}

/* -------------------- Stage2 -------------------- */
export interface CharacterItemEquipment {
    date: string
    character_gender: string
    character_class: string
    preset_no: number
    item_equipment: ItemEquipment[]
    item_equipment_preset_1: ItemEquipment[]
    item_equipment_preset_2: ItemEquipment[]
    item_equipment_preset_3: ItemEquipment[]
}

export interface ItemEquipment {
    item_equipment_part: string
    item_equipment_slot: string
    item_name: string
    item_icon: string
    item_description: string
    item_shape_name: string
    item_shape_icon: string
    item_gender: string
    // ... (추가 옵션들 필요 시 확장)
}

export interface CharacterCashItemEquipment {
    date: string
    character_gender: string
    character_class: string
    character_look_mode: string
    preset_no: number
    cash_item_equipment_base: CashItem[]
    cash_item_equipment_preset_1: CashItem[]
    cash_item_equipment_preset_2: CashItem[]
    cash_item_equipment_preset_3: CashItem[]
}

export interface CashItem {
    cash_item_equipment_part: string
    cash_item_equipment_slot: string
    cash_item_name: string
    cash_item_icon: string
    cash_item_description: string
    // ... (option, expire 등 필요시 확장)
}

export interface CharacterSymbolEquipment {
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

export interface CharacterSetEffect {
    date: string
    set_effect: {
        set_name: string
        total_set_count: number
        set_effect_info: { set_count: number; set_option: string }[]
        set_option_full: { set_count: number; set_option: string }[]
    }[]
}

export interface CharacterSkill {
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

export interface CharacterLinkSkill {
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

export interface Stage2Data {
    itemEquip?: CharacterItemEquipment
    cashEquip?: CharacterCashItemEquipment
    symbolEquip?: CharacterSymbolEquipment
    setEffect?: CharacterSetEffect
    skill?: CharacterSkill[]
    linkSkill?: CharacterLinkSkill
}

/* -------------------- Stage3 -------------------- */
export interface CharacterVMatrix {
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

export interface CharacterHexaMatrix {
    date: string
    character_hexa_core_equipment: {
        hexa_core_name: string
        hexa_core_level: number
        hexa_core_type: string
        linked_skill: { hexa_skill_id: string }[]
    }[]
}

export interface CharacterHexaMatrixStat {
    date: string
    character_class: string
    character_hexa_stat_core: HexaStatCore[]
    character_hexa_stat_core_2: HexaStatCore[]
    character_hexa_stat_core_3: HexaStatCore[]
}

export interface HexaStatCore {
    slot_id: string
    main_stat_name: string
    sub_stat_name_1: string
    sub_stat_name_2: string
    main_stat_level: number
    sub_stat_level_1: number
    sub_stat_level_2: number
    stat_grade: number
}

export interface CharacterDojang {
    date: string
    character_class: string
    world_name: string
    dojang_best_floor: number
    date_dojang_record: string
    dojang_best_time: number
}

export interface RingExchangeSkillEquipment {
    date: string
    character_class: string
    special_ring_exchange_name: string
    special_ring_exchange_level: number
}

export interface CharacterOtherStat {
    date: string
    other_stat: {
        other_stat_type: string
        stat_info: { stat_name: string; stat_value: string }[]
    }[]
}

export interface Stage3Data {
    hexaMatrix?: CharacterHexaMatrix
    hexaStat?: CharacterHexaMatrixStat
    vMatrix?: CharacterVMatrix
    dojang?: CharacterDojang
    ring?: RingExchangeSkillEquipment
    otherStat?: CharacterOtherStat
}

/* -------------------- Stage4 -------------------- */
export interface CharacterBeautyEquipment {
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

export interface CharacterAndroidEquipment {
    date: string
    android_name: string
    android_icon: string
    android_description: string
    android_gender: string
    android_grade: string
    android_skin?: { skin_name: string; color_style: string }
}

export interface CharacterPetEquipment {
    date: string
    pet_1_name: string
    pet_1_icon: string
    pet_1_description: string
    // ... (펫2, 펫3도 동일 구조)
}

export interface CharacterPropensity {
    date: string
    charisma_level: number
    sensibility_level: number
    insight_level: number
    willingness_level: number
    handicraft_level: number
    charm_level: number
}

export interface CharacterAbility {
    date: string
    ability_preset_no: number
    ability_info: {
        ability_no: number
        ability_grade: string
        ability_value: string
    }[]
}

export interface Stage4Data {
    beauty?: CharacterBeautyEquipment
    android?: CharacterAndroidEquipment
    pet?: CharacterPetEquipment
    propensity?: CharacterPropensity
    ability?: CharacterAbility
}