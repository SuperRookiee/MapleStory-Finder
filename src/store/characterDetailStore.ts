// characterDetailStore.ts
import { create } from 'zustand'
import { IStage1Data, IStage2Data, IStage3Data, IStage4Data } from "@/interface/ICharacter"
import { ICharacterResponse } from "@/interface/ICharacterResponse"

type CharacterDetailSlice = {
    // 기본 정보
    basic: Pick<ICharacterResponse, 'character_image' | 'character_name'> | null
    stat: IStage1Data['stat'] | null
    popularity: IStage1Data['popularity'] | null
    hyper: IStage1Data['hyper'] | null

    // 장비 / 스킬
    itemEquip: IStage2Data['itemEquip'] | null
    cashEquip: IStage2Data['cashEquip'] | null
    symbolEquip: IStage2Data['symbolEquip'] | null
    setEffect: IStage2Data['setEffect'] | null
    skill: IStage2Data['skill'] | null
    linkSkill: IStage2Data['linkSkill'] | null

    // 심화
    hexaMatrix: IStage3Data['hexaMatrix'] | null
    hexaStat: IStage3Data['hexaStat'] | null
    vMatrix: IStage3Data['vMatrix'] | null
    dojang: IStage3Data['dojang'] | null
    ring: IStage3Data['ring'] | null
    otherStat: IStage3Data['otherStat'] | null

    // 꾸미기 / 기타
    beauty: IStage4Data['beauty'] | null
    android: IStage4Data['android'] | null
    pet: IStage4Data['pet'] | null
    propensity: IStage4Data['propensity'] | null
    ability: IStage4Data['ability'] | null

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