// characterDetailStore.ts
import { create } from 'zustand'
import {
    ICharacterStat,
    ICharacterPopularity,
    ICharacterHyperStat,
    ICharacterItemEquipment,
    ICharacterCashItemEquipment,
    ICharacterSymbolEquipment,
    ICharacterSetEffect,
    ICharacterSkill,
    ICharacterLinkSkill,
    ICharacterHexaMatrix,
    ICharacterHexaMatrixStat,
    ICharacterVMatrix,
    ICharacterDojang,
    IRingExchangeSkillEquipment,
    ICharacterOtherStat,
    ICharacterBeautyEquipment,
    ICharacterAndroidEquipment,
    ICharacterPetEquipment,
    ICharacterPropensity,
    ICharacterAbility,
} from "@/interface/ICharacter";
import { ICharacterResponse } from "@/interface/ICharacterResponse";

type CharacterDetailSlice = {
    // 기본 정보
    basic: Pick<ICharacterResponse, 'character_image' | 'character_name'> | null
    stat: ICharacterStat | null
    popularity: ICharacterPopularity | null
    hyper: ICharacterHyperStat | null

    // 장비 / 스킬
    itemEquip: ICharacterItemEquipment | null
    cashEquip: ICharacterCashItemEquipment | null
    symbolEquip: ICharacterSymbolEquipment | null
    setEffect: ICharacterSetEffect | null
    skill: ICharacterSkill[] | null
    linkSkill: ICharacterLinkSkill | null

    // 심화
    hexaMatrix: ICharacterHexaMatrix | null
    hexaStat: ICharacterHexaMatrixStat | null
    vMatrix: ICharacterVMatrix | null
    dojang: ICharacterDojang | null
    ring: IRingExchangeSkillEquipment | null
    otherStat: ICharacterOtherStat | null

    // 꾸미기 / 기타
    beauty: ICharacterBeautyEquipment | null
    android: ICharacterAndroidEquipment | null
    pet: ICharacterPetEquipment | null
    propensity: ICharacterPropensity | null
    ability: ICharacterAbility | null

    // setter
    setBasic: (basic: CharacterDetailSlice['basic']) => void
    setStat: (stat: CharacterDetailSlice['stat']) => void
    setPopularity: (popularity: CharacterDetailSlice['popularity']) => void
    setHyper: (hyper: CharacterDetailSlice['hyper']) => void
    setItemEquip: (itemEquip: CharacterDetailSlice['itemEquip']) => void
    setCashEquip: (cashEquip: CharacterDetailSlice['cashEquip']) => void
    setSymbolEquip: (symbolEquip: CharacterDetailSlice['symbolEquip']) => void
    setSetEffect: (setEffect: CharacterDetailSlice['setEffect']) => void
    setSkill: (skill: CharacterDetailSlice['skill']) => void
    setLinkSkill: (linkSkill: CharacterDetailSlice['linkSkill']) => void
    setHexaMatrix: (hexaMatrix: CharacterDetailSlice['hexaMatrix']) => void
    setHexaStat: (hexaStat: CharacterDetailSlice['hexaStat']) => void
    setVMatrix: (vMatrix: CharacterDetailSlice['vMatrix']) => void
    setDojang: (dojang: CharacterDetailSlice['dojang']) => void
    setRing: (ring: CharacterDetailSlice['ring']) => void
    setOtherStat: (otherStat: CharacterDetailSlice['otherStat']) => void
    setBeauty: (beauty: CharacterDetailSlice['beauty']) => void
    setAndroid: (android: CharacterDetailSlice['android']) => void
    setPet: (pet: CharacterDetailSlice['pet']) => void
    setPropensity: (propensity: CharacterDetailSlice['propensity']) => void
    setAbility: (ability: CharacterDetailSlice['ability']) => void
}

export const characterDetailStore = create<CharacterDetailSlice>((set) => ({
    basic: null,
    stat: null,
    popularity: null,
    hyper: null,

    itemEquip: null,
    cashEquip: null,
    symbolEquip: null,
    setEffect: null,
    skill: null,
    linkSkill: null,

    hexaMatrix: null,
    hexaStat: null,
    vMatrix: null,
    dojang: null,
    ring: null,
    otherStat: null,

    beauty: null,
    android: null,
    pet: null,
    propensity: null,
    ability: null,

    setBasic: (basic) => set({ basic }),
    setStat: (stat) => set({ stat }),
    setPopularity: (popularity) => set({ popularity }),
    setHyper: (hyper) => set({ hyper }),
    setItemEquip: (itemEquip) => set({ itemEquip }),
    setCashEquip: (cashEquip) => set({ cashEquip }),
    setSymbolEquip: (symbolEquip) => set({ symbolEquip }),
    setSetEffect: (setEffect) => set({ setEffect }),
    setSkill: (skill) => set({ skill }),
    setLinkSkill: (linkSkill) => set({ linkSkill }),
    setHexaMatrix: (hexaMatrix) => set({ hexaMatrix }),
    setHexaStat: (hexaStat) => set({ hexaStat }),
    setVMatrix: (vMatrix) => set({ vMatrix }),
    setDojang: (dojang) => set({ dojang }),
    setRing: (ring) => set({ ring }),
    setOtherStat: (otherStat) => set({ otherStat }),
    setBeauty: (beauty) => set({ beauty }),
    setAndroid: (android) => set({ android }),
    setPet: (pet) => set({ pet }),
    setPropensity: (propensity) => set({ propensity }),
    setAbility: (ability) => set({ ability }),
}));