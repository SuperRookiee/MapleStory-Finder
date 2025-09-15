"use client";

import Image from "next/image";
import { unstable_ViewTransition as ViewTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import CharacterBanner from "@/components/character/CharacterBanner";
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
import { Union } from "@/components/character/detail/Union";
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
} from "@/fetchs/character.fetch";
import { findGuildBasic, findGuildId } from "@/fetchs/guild.fetch";
import { findUnion, findUnionArtifact, findUnionRaider } from "@/fetchs/union.fetch";
import { characterDetailStore } from "@/stores/characterDetailStore";

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const {
        basic, stat, popularity, hyper,
        union, unionRaider, unionArtifact,
        itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill,
        hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat,
        beauty, android, pet, propensity, ability, guild,
        setBasic, setStat, setPopularity, setHyper, setGuild,
        setUnion, setUnionRaider, setUnionArtifact,
        setItemEquip, setCashEquip, setSymbolEquip, setSetEffect, setSkill, setLinkSkill,
        setHexaMatrix, setHexaStat, setVMatrix, setDojang, setRing, setOtherStat,
        setBeauty, setAndroid, setPet, setPropensity, setAbility,
        reset,
    } = characterDetailStore();
    const [imageScale, setImageScale] = useState(1);
    const [basicLoading, setBasicLoading] = useState(true);
    const [tab, setTab] = useState("basic");
    const smallImageOpacity = (1 - imageScale) / 0.6;
    const SMALL_IMAGE_SIZE = 40;
    const SCROLL_HIDE_THRESHOLD = SMALL_IMAGE_SIZE * 6.25;

    // 기본 정보 로딩
    useEffect(() => {
        if (!ocid) return;

        const load = async () => {
            setBasicLoading(true);
            try {
                const [basicRes, statRes, popularityRes, hyperRes, abilityRes, unionRes, dojangRes] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterStat(ocid),
                    findCharacterPopularity(ocid),
                    findCharacterHyperStat(ocid),
                    findCharacterAbility(ocid),
                    findUnion(ocid),
                    findCharacterDojang(ocid),
                ]);
                setBasic(basicRes.data);
                setStat(statRes.data);
                setPopularity(popularityRes.data);
                setHyper(hyperRes.data);
                setAbility(abilityRes.data);
                setUnion(unionRes.data);
                setDojang(dojangRes.data);

                if (basicRes.data.character_guild_name) {
                    try {
                        const guildIdRes = await findGuildId(
                            basicRes.data.character_guild_name,
                            basicRes.data.world_name,
                        );
                        const guildRes = await findGuildBasic(
                            guildIdRes.data.oguild_id,
                        );
                        setGuild(guildRes.data);
                    } catch (e) {
                        console.error(e);
                    }
                }
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
    }, [ocid, reset, setBasic, setStat, setPopularity, setHyper, setAbility, setUnion, setDojang, setGuild]);

    // 유니온 탭 로딩
    useEffect(() => {
        if (tab !== "union" || (union && unionRaider && unionArtifact)) return;
        const loadUnion = async () => {
            try {
                const [unionRes, raiderRes, artifactRes] = await Promise.all([
                    union ? Promise.resolve(null) : findUnion(ocid),
                    findUnionRaider(ocid),
                    findUnionArtifact(ocid),
                ]);
                if (!union && unionRes) setUnion(unionRes.data);
                setUnionRaider(raiderRes.data);
                setUnionArtifact(artifactRes.data);
            } catch (e) {
                console.error(e);
                toast.error('유니온 정보 로딩 실패');
            }
        };
        loadUnion();
    }, [tab, ocid, union, unionRaider, unionArtifact, setUnion, setUnionRaider, setUnionArtifact]);

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
                    ringRes,
                    otherStatRes,
                    propensityRes,
                    dojangRes,
                ] = await Promise.all([
                    findCharacterRingExchange(ocid),
                    findCharacterOtherStat(ocid),
                    findCharacterPropensity(ocid),
                    dojang ? Promise.resolve(null) : findCharacterDojang(ocid),
                ]);
                if (!dojang && dojangRes) setDojang(dojangRes.data);
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
                const progress = Math.min(top / SCROLL_HIDE_THRESHOLD, 1);
                const scale = 1 - progress * 0.6;
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
                    <CharacterBanner
                        basic={basic}
                        popularity={popularity}
                        union={union}
                        dojang={dojang}
                        guild={guild}
                        loading={basicLoading || !basic}
                        imageScale={imageScale}
                    />

                    {basicLoading || !basic ? (
                        <Skeleton className="h-6 w-40 mx-auto" />
                    ) : (
                        <div className="sticky top-0 z-50 bg-background/90 py-2 mt-0 -mx-4 px-4 flex items-center justify-between">
                            {/* 왼쪽: 탭 */}
                            <Tabs value={tab} onValueChange={setTab} className="flex-1">
                                <TabsList className="flex space-x-2">
                                    <TabsTrigger value="basic">기본 정보</TabsTrigger>
                                    <TabsTrigger value="union">유니온</TabsTrigger>
                                    <TabsTrigger value="equip">장비</TabsTrigger>
                                    <TabsTrigger value="skill">스킬</TabsTrigger>
                                    <TabsTrigger value="cash">캐시</TabsTrigger>
                                    <TabsTrigger value="etc">기타</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* 오른쪽: 캐릭터 요약 */}
                            <div className="flex items-center font-bold">
                                {basic.character_image && (
                                    <Image
                                        src={`/api/crop?url=${encodeURIComponent(
                                            basic.character_image
                                        )}`}
                                        alt={basic.character_name}
                                        width={SMALL_IMAGE_SIZE}
                                        height={SMALL_IMAGE_SIZE}
                                        className="mr-2 object-contain transition-opacity"
                                        style={{ opacity: smallImageOpacity }}
                                    />
                                )}
                                <span
                                    className="transition-opacity"
                                    style={{ opacity: smallImageOpacity }}
                                >
                                    {basic.character_name}
                                    <span className="ml-2 text-muted-foreground font-normal">
                                        {basic.character_class}
                                        <span className="ml-2">Lv. {basic.character_level}</span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}

                    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                        {/* 기본 정보 */}
                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
                                <div className="space-y-4">
                                    <Stat stat={stat} loading={basicLoading || !stat} />
                                </div>
                                <div className="space-y-4">
                                    <HyperStat hyper={hyper} loading={basicLoading || !hyper} />
                                    <Ability ability={ability} loading={basicLoading || !ability} />
                                    <Popularity
                                        popularity={popularity?.popularity}
                                        loading={basicLoading || !popularity}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* 유니온 */}
                        <TabsContent value="union" className="space-y-4">
                            <Union
                                union={union}
                                raider={unionRaider}
                                artifact={unionArtifact}
                                loading={!union || !unionRaider || !unionArtifact}
                            />
                        </TabsContent>

                        {/* 장비 */}
                        <TabsContent value="equip" className="space-y-4">
                            <ItemEquipments
                                items={itemEquip?.item_equipment || []}
                                loading={!itemEquip}
                            />
                            <SymbolEquip symbol={symbolEquip} loading={!symbolEquip} />
                            <SetEffect setEffect={setEffect} loading={!setEffect} />
                        </TabsContent>

                        {/* 스킬 */}
                        <TabsContent value="skill" className="space-y-4">
                            <Skill skill={skill} loading={!skill} />
                            <LinkSkill linkSkill={linkSkill} loading={!linkSkill} />
                            <HexaStat hexaStat={hexaStat} loading={!hexaStat} />
                            <HexaMatrix hexaMatrix={hexaMatrix} loading={!hexaMatrix} />
                            <VMatrix vMatrix={vMatrix} loading={!vMatrix} />
                        </TabsContent>

                        {/* 캐시 */}
                        <TabsContent value="cash" className="space-y-4">
                            <CashEquip equip={cashEquip} loading={!cashEquip} />
                            <Beauty beauty={beauty} loading={!beauty} />
                            <Android android={android} loading={!android} />
                            <Pet pet={pet} loading={!pet} />
                        </TabsContent>

                        {/* 기타 */}
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