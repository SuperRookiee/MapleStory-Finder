'use client'

import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition, useEffect, useState } from 'react';
import { toast } from "sonner";
import { Ability } from "@/components/character/detail/Ability";
import { Android } from "@/components/character/detail/Android";
import { Beauty } from "@/components/character/detail/Beauty";
import { CashEquip } from "@/components/character/detail/CashEquip";
import { Dojang } from "@/components/character/detail/Dojang";
import { HexaMatrix } from "@/components/character/detail/HexaMatrix";
import { HexaStat } from "@/components/character/detail/HexaStat";
import { HyperStat } from "@/components/character/detail/HyperStat";
import { LinkSkill } from "@/components/character/detail/LinkSkill";
import { OtherStat } from "@/components/character/detail/OtherStat";
import { Pet } from "@/components/character/detail/Pet";
import { Popularity } from "@/components/character/detail/Popularity";
import { Propensity } from "@/components/character/detail/Propensity";
import { Ring } from "@/components/character/detail/Ring";
import { SetEffect } from "@/components/character/detail/SetEffect";
import { Skill } from "@/components/character/detail/Skill";
import { Stat } from "@/components/character/detail/Stat";
import { SymbolEquip } from "@/components/character/detail/SymbolEquip";
import { VMatrix } from "@/components/character/detail/VMatrix";
import ItemEquipments from "@/components/character/item/ItemEquipments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    findCharacterAbility,
    findCharacterAndroidEquipment,
    findCharacterBasic,
    findCharacterBeautyEquipment,
    findCharacterCashItemEquipment,
    findCharacterDojang,
    findCharacterHexaMatrix,
    findCharacterHexaMatrixStat,
    findCharacterHyperStat,
    findCharacterItemEquipment,
    findCharacterLinkSkill,
    findCharacterOtherStat,
    findCharacterPetEquipment,
    findCharacterPopularity,
    findCharacterPropensity,
    findCharacterRingExchange,
    findCharacterSetEffect,
    findCharacterSkill,
    findCharacterStat,
    findCharacterSymbolEquipment,
    findCharacterVMatrix,
} from '@/fetchs/character.fetch';
import { characterDetailStore } from "@/stores/characterDetailStore";

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const {
        basic, stat, popularity, hyper,
        itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill,
        hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat,
        beauty, android, pet, propensity, ability,
        setBasic, setStat, setPopularity, setHyper,
        setItemEquip, setCashEquip, setSymbolEquip, setSetEffect, setSkill, setLinkSkill,
        setHexaMatrix, setHexaStat, setVMatrix, setDojang, setRing, setOtherStat,
        setBeauty, setAndroid, setPet, setPropensity, setAbility,
        reset,
    } = characterDetailStore();
    const [imageScale, setImageScale] = useState(1);
    const [basicLoading, setBasicLoading] = useState(true);
    const [tab, setTab] = useState("basic");

    // 기본 정보 로딩
    useEffect(() => {
        if (!ocid) return;

        const load = async () => {
            setBasicLoading(true);
            try {
                const [basicRes, statRes, popularityRes, hyperRes, abilityRes] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterStat(ocid),
                    findCharacterPopularity(ocid),
                    findCharacterHyperStat(ocid),
                    findCharacterAbility(ocid),
                ]);
                setBasic(basicRes.data);
                setStat(statRes.data);
                setPopularity(popularityRes.data);
                setHyper(hyperRes.data);
                setAbility(abilityRes.data);
            } catch (e) {
                console.error(e);
                toast.error('캐릭터 정보 로딩 실패');
            } finally {
                setBasicLoading(false);
            }
        };

        reset();
        setTab("basic");
        load();
    }, [ocid, reset, setBasic, setStat, setPopularity, setHyper, setAbility]);

    // 장비 탭 로딩
    useEffect(() => {
        if (tab !== "equip" || (itemEquip && symbolEquip && setEffect)) return;
        const loadEquip = async () => {
            try {
                const [itemEquipRes, symbolEquipRes, setEffectRes] = await Promise.all([
                    findCharacterItemEquipment(ocid),
                    findCharacterSymbolEquipment(ocid),
                    findCharacterSetEffect(ocid),
                ]);
                setItemEquip(itemEquipRes.data);
                setSymbolEquip(symbolEquipRes.data);
                setSetEffect(setEffectRes.data);
            } catch (e) {
                console.error(e);
                toast.error('장비 정보 로딩 실패');
            }
        };
        loadEquip();
    }, [tab, ocid, itemEquip, symbolEquip, setEffect, setItemEquip, setSymbolEquip, setSetEffect]);

    // 스킬 탭 로딩
    useEffect(() => {
        if (tab !== "skill" || (skill && linkSkill && hexaMatrix && hexaStat && vMatrix)) return;
        const loadSkill = async () => {
            try {
                const grades = ['0', '1', '2', '3', '4', '5', '6', 'hyperpassive', 'hyperactive'];
                const [
                    skillRes,
                    linkSkillRes,
                    hexaMatrixRes,
                    hexaStatRes,
                    vMatrixRes,
                ] = await Promise.all([
                    Promise.all(grades.map((g) => findCharacterSkill(ocid, g))),
                    findCharacterLinkSkill(ocid),
                    findCharacterHexaMatrix(ocid),
                    findCharacterHexaMatrixStat(ocid),
                    findCharacterVMatrix(ocid),
                ]);
                setSkill(skillRes.map((s) => s.data));
                setLinkSkill(linkSkillRes.data);
                setHexaMatrix(hexaMatrixRes.data);
                setHexaStat(hexaStatRes.data);
                setVMatrix(vMatrixRes.data);
            } catch (e) {
                console.error(e);
                toast.error('스킬 정보 로딩 실패');
            }
        };
        loadSkill();
    }, [
        tab,
        ocid,
        skill,
        linkSkill,
        hexaMatrix,
        hexaStat,
        vMatrix,
        setSkill,
        setLinkSkill,
        setHexaMatrix,
        setHexaStat,
        setVMatrix,
    ]);

    // 캐시 탭 로딩
    useEffect(() => {
        if (tab !== "cash" || (cashEquip && beauty && android && pet)) return;
        const loadCash = async () => {
            try {
                const [cashEquipRes, beautyRes, androidRes, petRes] = await Promise.all([
                    findCharacterCashItemEquipment(ocid),
                    findCharacterBeautyEquipment(ocid),
                    findCharacterAndroidEquipment(ocid),
                    findCharacterPetEquipment(ocid),
                ]);
                setCashEquip(cashEquipRes.data);
                setBeauty(beautyRes.data);
                setAndroid(androidRes.data);
                setPet(petRes.data);
            } catch (e) {
                console.error(e);
                toast.error('캐시 정보 로딩 실패');
            }
        };
        loadCash();
    }, [tab, ocid, cashEquip, beauty, android, pet, setCashEquip, setBeauty, setAndroid, setPet]);

    // 기타 탭 로딩
    useEffect(() => {
        if (tab !== "etc" || (dojang && ring && otherStat && propensity)) return;
        const loadEtc = async () => {
            try {
                const [
                    dojangRes,
                    ringRes,
                    otherStatRes,
                    propensityRes,
                ] = await Promise.all([
                    findCharacterDojang(ocid),
                    findCharacterRingExchange(ocid),
                    findCharacterOtherStat(ocid),
                    findCharacterPropensity(ocid),
                ]);
                setDojang(dojangRes.data);
                setRing(ringRes.data);
                setOtherStat(otherStatRes.data);
                setPropensity(propensityRes.data);
            } catch (e) {
                console.error(e);
                toast.error('기타 정보 로딩 실패');
            }
        };
        loadEtc();
    }, [
        tab,
        ocid,
        dojang,
        ring,
        otherStat,
        propensity,
        setDojang,
        setRing,
        setOtherStat,
        setPropensity,
    ]);

    useEffect(() => {
        const viewport = document.querySelector(
            '#character-detail-scroll [data-slot="scroll-area-viewport"]'
        ) as HTMLElement | null;
        if (!viewport) return;

        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;

            window.requestAnimationFrame(() => {
                const top = viewport.scrollTop;
                const progress = Math.min(top / 300, 1);
                const scale = 1 - progress * 0.2;
                setImageScale(scale);
                ticking = false;
            });

            ticking = true;
        };

        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, [basicLoading]);

    return (
        <ViewTransition enter="fade" exit="fade">
            <ScrollArea id="character-detail-scroll" className="h-page">
                <div className="space-y-6 p-4 w-full max-w-5xl mx-auto">
                    <div
                        className="relative w-80 h-80 mx-auto"
                        style={{
                            transform: `scale(${imageScale})`,
                            opacity: imageScale,
                        }}
                    >
                        {basicLoading || !basic ? (
                            <Skeleton className="w-full h-full" />
                        ) : (
                            basic.character_image && (
                                <Image
                                    src={basic.character_image}
                                    alt={basic.character_name}
                                    className="object-contain"
                                    fill
                                    priority
                                />
                            )
                        )}
                    </div>
                    {basicLoading || !basic ? (
                        <Skeleton className="h-6 w-40 mx-auto" />
                    ) : (
                        <p className="text-center font-bold mt-2">{basic.character_name}</p>
                    )}

                    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="basic">기본정보</TabsTrigger>
                            <TabsTrigger value="equip">장비</TabsTrigger>
                            <TabsTrigger value="skill">스킬</TabsTrigger>
                            <TabsTrigger value="cash">캐시</TabsTrigger>
                            <TabsTrigger value="etc">기타</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
                                <div className="space-y-4">
                                    <Stat stat={stat} loading={basicLoading || !stat} />
                                </div>
                                <div className="space-y-4">
                                    <Ability ability={ability} loading={basicLoading || !ability} />
                                    <Popularity
                                        popularity={popularity?.popularity}
                                        loading={basicLoading || !popularity}
                                    />
                                    <HyperStat hyper={hyper} loading={basicLoading || !hyper} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="equip" className="space-y-4">
                            <ItemEquipments
                                items={itemEquip?.item_equipment || []}
                                loading={!itemEquip}
                            />
                            <SymbolEquip symbol={symbolEquip} loading={!symbolEquip} />
                            <SetEffect setEffect={setEffect} loading={!setEffect} />
                        </TabsContent>

                        <TabsContent value="skill" className="space-y-4">
                            <Skill skill={skill} loading={!skill} />
                            <LinkSkill linkSkill={linkSkill} loading={!linkSkill} />
                            <HexaStat hexaStat={hexaStat} loading={!hexaStat} />
                            <HexaMatrix hexaMatrix={hexaMatrix} loading={!hexaMatrix} />
                            <VMatrix vMatrix={vMatrix} loading={!vMatrix} />
                        </TabsContent>

                        <TabsContent value="cash" className="space-y-4">
                            <CashEquip equip={cashEquip} loading={!cashEquip} />
                            <Beauty beauty={beauty} loading={!beauty} />
                            <Android android={android} loading={!android} />
                            <Pet pet={pet} loading={!pet} />
                        </TabsContent>

                        <TabsContent value="etc" className="space-y-4">
                            <Dojang dojang={dojang} loading={!dojang} />
                            <Ring ring={ring} loading={!ring} />
                            <OtherStat otherStat={otherStat} loading={!otherStat} />
                            <Propensity propensity={propensity} loading={!propensity} />
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterDetail;
