import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ICharacterAbility, ICharacterAndroidEquipment, ICharacterBasic, ICharacterBeautyEquipment, ICharacterCashItemEquipment, ICharacterDojang, ICharacterHexaMatrix, ICharacterHexaMatrixStat, ICharacterHyperStat, ICharacterItemEquipment, ICharacterLinkSkill, ICharacterOtherStat, ICharacterPetEquipment, ICharacterPopularity, ICharacterPropensity, ICharacterSetEffect, ICharacterSkill, ICharacterStat, ICharacterSymbolEquipment, ICharacterVMatrix, IRingExchangeSkillEquipment, } from "@/interface/character/ICharacter";
import { IUnion, IUnionArtifact, IUnionChampion, IUnionRaider } from "@/interface/union/IUnion";

type CharacterDetailSlice = {
    // 기본 정보
    basic: Pick<ICharacterBasic, 'character_image' | 'character_name' | 'character_class'> | null
    stat: ICharacterStat | null
    popularity: ICharacterPopularity | null
    hyper: ICharacterHyperStat | null

    // 유니온
    union: IUnion | null
    unionRaider: IUnionRaider | null
    unionArtifact: IUnionArtifact | null
    unionChampion: IUnionChampion | null

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
    setUnion: (union: CharacterDetailSlice['union']) => void
    setUnionRaider: (unionRaider: CharacterDetailSlice['unionRaider']) => void
    setUnionArtifact: (unionArtifact: CharacterDetailSlice['unionArtifact']) => void
    setUnionChampion: (unionChampion: CharacterDetailSlice['unionChampion']) => void
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

    // util
    reset: () => void
}

const initialState: Omit<
    CharacterDetailSlice,
    | 'setBasic'
    | 'setStat'
    | 'setPopularity'
    | 'setHyper'
    | 'setItemEquip'
    | 'setCashEquip'
    | 'setSymbolEquip'
    | 'setSetEffect'
    | 'setSkill'
    | 'setLinkSkill'
    | 'setHexaMatrix'
    | 'setHexaStat'
    | 'setVMatrix'
    | 'setDojang'
    | 'setRing'
    | 'setOtherStat'
    | 'setBeauty'
    | 'setAndroid'
    | 'setPet'
    | 'setPropensity'
    | 'setAbility'
    | 'setUnion'
    | 'setUnionRaider'
    | 'setUnionArtifact'
    | 'setUnionChampion'
    | 'reset'
> = {
    basic: null,
    stat: null,
    popularity: null,
    hyper: null,

    union: null,
    unionRaider: null,
    unionArtifact: null,
    unionChampion: null,

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
};

export const characterDetailStore = create<CharacterDetailSlice>()(
    persist(
        (set) => ({
            ...initialState,

            setBasic: (basic) => set({ basic }),
            setStat: (stat) => set({ stat }),
            setPopularity: (popularity) => set({ popularity }),
            setHyper: (hyper) => set({ hyper }),
            setUnion: (union) => set({ union }),
            setUnionRaider: (unionRaider) => set({ unionRaider }),
            setUnionArtifact: (unionArtifact) => set({ unionArtifact }),
            setUnionChampion: (unionChampion) => set({ unionChampion }),
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
            reset: () => set(initialState),
        }),
        {
            name: "characterDetailStore",
        }
    )
);
