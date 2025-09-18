"use client";

import Image from "next/image";
import { unstable_ViewTransition as ViewTransition, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { characterDetailStore } from "@/stores/characterDetailStore";
import { useCharacterPreviewStore } from "@/stores/characterPreviewStore";
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
import { Propensity } from "@/components/character/detail/Propensity";
import { Ranking } from "@/components/character/detail/Ranking";
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
import { findCharacterAbility, findCharacterAndroidEquipment, findCharacterBasic, findCharacterBeautyEquipment, findCharacterCashItemEquipment, findCharacterDojang, findCharacterHexaMatrix, findCharacterHexaMatrixStat, findCharacterHyperStat, findCharacterItemEquipment, findCharacterLinkSkill, findCharacterOtherStat, findCharacterPetEquipment, findCharacterPropensity, findCharacterRingExchange, findCharacterSetEffect, findCharacterSkill, findCharacterStat, findCharacterSymbolEquipment, findCharacterVMatrix, } from "@/fetchs/character.fetch";
import { findGuildBasic, findGuildId } from "@/fetchs/guild.fetch";
import { findAchievementRanking, findDojangRanking, findOverallRanking, findTheSeedRanking, findUnionRanking, } from "@/fetchs/ranking.fetch";
import { findUnion, findUnionArtifact, findUnionRaider } from "@/fetchs/union.fetch";
import { IRankingResponse } from "@/interface/ranking/IRankingResponse";
import { useTranslations } from "@/providers/LanguageProvider";

const getTodayKstDate = () => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60_000;
    const kst = new Date(utcTime + 9 * 60 * 60_000);
    return kst.toISOString().slice(0, 10);
};

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const {
        basic, stat, rankings, hyper,
        union, unionRaider, unionArtifact,
        itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill,
        hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat,
        beauty, android, pet, propensity, ability, guild,
        setBasic, setStat, setRankings, setHyper, setGuild,
        setUnion, setUnionRaider, setUnionArtifact,
        setItemEquip, setCashEquip, setSymbolEquip, setSetEffect, setSkill, setLinkSkill,
        setHexaMatrix, setHexaStat, setVMatrix, setDojang, setRing, setOtherStat,
        setBeauty, setAndroid, setPet, setPropensity, setAbility,
        reset,
    } = characterDetailStore();
    const t = useTranslations();
    const [imageScale, setImageScale] = useState(1);
    const [basicLoading, setBasicLoading] = useState(true);
    const [tab, setTab] = useState("basic");
    const smallImageOpacity = (1 - imageScale) / 0.6;
    const SMALL_IMAGE_SIZE = 40;
    const SCROLL_HIDE_THRESHOLD = SMALL_IMAGE_SIZE * 6.25;
    const previewOcid = useCharacterPreviewStore((state) => state.ocid);
    const previewBasic = useCharacterPreviewStore((state) => state.basic);
    const matchedPreviewBasic = previewOcid === ocid ? previewBasic : null;
    const characterImageSrc = useMemo(() => {
        const source = basic?.character_image ?? matchedPreviewBasic?.character_image;
        if (!source) return null;
        return `/api/crop?url=${encodeURIComponent(source)}`;
    }, [basic?.character_image, matchedPreviewBasic?.character_image]);
    const imageTransitionName = useMemo(() => {
        const sanitized = ocid.replace(/[^a-zA-Z0-9_-]/g, "-");
        return `character-image-${sanitized}`;
    }, [ocid]);

    // 기본 정보 로딩
    useEffect(() => {
        if (!ocid) return;

        let cancelled = false;
        const load = async () => {
            const shouldFetchBasic = !matchedPreviewBasic;
            setBasicLoading(shouldFetchBasic);
            try {
                const safeRankingFetch = async <T, >(promise: Promise<IRankingResponse<T>>) => {
                    try {
                        return await promise;
                    } catch (error) {
                        console.error(error);
                        return null;
                    }
                };

                const [basicRes, statRes, hyperRes, abilityRes, unionRes, dojangRes] =
                    await Promise.all([
                        shouldFetchBasic ? findCharacterBasic(ocid) : Promise.resolve(null),
                        findCharacterStat(ocid),
                        findCharacterHyperStat(ocid),
                        findCharacterAbility(ocid),
                        findUnion(ocid),
                        findCharacterDojang(ocid),
                    ]);
                if (cancelled) return;
                const basicData = shouldFetchBasic ? basicRes?.data ?? null : matchedPreviewBasic;
                if (shouldFetchBasic && basicData) {
                    setBasic(basicData);
                }
                console.log(abilityRes)
                setStat(statRes.data);
                setHyper(hyperRes.data);
                setAbility(abilityRes.data);
                setUnion(unionRes.data);
                setDojang(dojangRes.data);

                const worldNameForRanking = basicData?.world_name ?? matchedPreviewBasic?.world_name;
                if (worldNameForRanking) {
                    const requestDate = getTodayKstDate();
                    const [
                        overallRankingRes,
                        unionRankingRes,
                        dojangRankingRes,
                        theseedRankingRes,
                        achievementRankingRes,
                    ] = await Promise.all([
                        safeRankingFetch(
                            findOverallRanking(ocid, {
                                date: requestDate,
                                world_name: worldNameForRanking,
                            }),
                        ),
                        safeRankingFetch(
                            findUnionRanking(ocid, {
                                date: requestDate,
                                world_name: worldNameForRanking,
                            }),
                        ),
                        safeRankingFetch(
                            findDojangRanking(ocid, {
                                date: requestDate,
                                world_name: worldNameForRanking,
                                difficulty: 0,
                            }),
                        ),
                        safeRankingFetch(
                            findTheSeedRanking(ocid, {
                                date: requestDate,
                                world_name: worldNameForRanking,
                            }),
                        ),
                        safeRankingFetch(
                            findAchievementRanking(ocid, {
                                date: requestDate,
                                world_name: worldNameForRanking,
                            }),
                        ),
                    ]);

                    const rankingData = {
                        overall: overallRankingRes?.data.ranking?.[0] ?? null,
                        union: unionRankingRes?.data.ranking?.[0] ?? null,
                        dojang: dojangRankingRes?.data.ranking?.[0] ?? null,
                        theseed: theseedRankingRes?.data.ranking?.[0] ?? null,
                        achievement: achievementRankingRes?.data.ranking?.[0] ?? null,
                    };

                    const hasRankingData = Object.values(rankingData).some(
                        (entry) => entry !== null,
                    );

                    setRankings(hasRankingData ? rankingData : null);
                } else {
                    setRankings(null);
                }

                if (basicData?.character_guild_name) {
                    try {
                        const guildIdRes = await findGuildId(
                            basicData.character_guild_name,
                            basicData.world_name,
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
                if (!cancelled) {
                    console.error(e);
                    toast.error(t('character.detail.toast.loadCharacter'));
                }
            } finally {
                if (!cancelled) {
                    setBasicLoading(false);
                }
            }
        };

        reset(matchedPreviewBasic ? { basic: matchedPreviewBasic } : undefined);
        setTab("basic");
        load();
        return () => {
            cancelled = true;
        };
    }, [ocid, matchedPreviewBasic, reset]);

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
                toast.error(t('character.detail.toast.loadUnion'));
            }
        };
        loadUnion();
    }, [tab, ocid, union, unionRaider, unionArtifact]);

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
                toast.error(t('character.detail.toast.loadEquip'));
            }
        };
        loadEquip();
    }, [tab, ocid, itemEquip, symbolEquip]);

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
                toast.error(t('character.detail.toast.loadSkill'));
            }
        };
        loadSkill();
    }, [tab, ocid, skill, linkSkill, hexaMatrix, hexaStat, vMatrix]);

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
                toast.error(t('character.detail.toast.loadCash'));
            }
        };
        loadCash();
    }, [tab, ocid, cashEquip, beauty, android, pet]);

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
                toast.error(t('character.detail.toast.loadEtc'));
            }
        };
        loadEtc();
    }, [tab, ocid, dojang, ring, otherStat, propensity]);

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
                        overallRanking={rankings?.overall ?? null}
                        union={union}
                        dojang={dojang}
                        guild={guild}
                        loading={basicLoading || !basic}
                        imageScale={imageScale}
                        imageSrc={characterImageSrc ?? undefined}
                        imageTransitionName={imageTransitionName}
                    />

                    {basicLoading || !basic ? (
                        <Skeleton className="h-8 w-1/3"/>
                    ) : (
                        <div className="sticky top-0 z-50 bg-background/90 py-2 mt-0 -mx-4 px-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                {/* 오른쪽: 캐릭터 요약 (모바일에서는 상단) */}
                                <div
                                    className="order-1 flex flex-row items-center justify-center gap-2 text-left font-bold sm:order-2 sm:items-center sm:gap-2 sm:justify-end">
                                    {characterImageSrc && (
                                        <Image
                                            src={characterImageSrc}
                                            alt={basic.character_name}
                                            width={SMALL_IMAGE_SIZE}
                                            height={SMALL_IMAGE_SIZE}
                                            className="object-contain transition-opacity h-auto"
                                            style={{ opacity: smallImageOpacity }}
                                        />
                                    )}
                                    <div
                                        className="transition-opacity"
                                        style={{ opacity: smallImageOpacity }}
                                    >
                                        <div>{basic.character_name}</div>
                                        <div className="mt-1 text-sm font-normal text-muted-foreground sm:mt-0 sm:flex sm:items-center sm:gap-2">
                                            <span>{basic.character_class}</span>
                                            <span>
                                                {t("common.level", { value: basic.character_level })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 왼쪽: 탭 (모바일에서는 하단) */}
                                <Tabs
                                    value={tab}
                                    onValueChange={setTab}
                                    className="order-2 w-full sm:order-1 sm:flex-1"
                                >
                                    <TabsList className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-0 sm:space-x-2">
                                        <TabsTrigger value="basic">{t('character.detail.tabs.basic')}</TabsTrigger>
                                        <TabsTrigger value="union">{t('character.detail.tabs.union')}</TabsTrigger>
                                        <TabsTrigger value="equip">{t('character.detail.tabs.equip')}</TabsTrigger>
                                        <TabsTrigger value="skill">{t('character.detail.tabs.skill')}</TabsTrigger>
                                        <TabsTrigger value="cash">{t('character.detail.tabs.cash')}</TabsTrigger>
                                        <TabsTrigger value="etc">{t('character.detail.tabs.etc')}</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    )}

                    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                        {/* 기본 정보 */}
                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
                                <div className="space-y-4">
                                    <Stat
                                        stat={stat}
                                        characterClass={basic?.character_class ?? stat?.character_class}
                                        loading={basicLoading || !stat}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <HyperStat hyper={hyper} loading={basicLoading || !hyper}/>
                                    <Ability ability={ability} loading={basicLoading || !ability}/>
                                    <Ranking ranking={rankings} loading={basicLoading}/>
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
                            <SymbolEquip symbol={symbolEquip} loading={!symbolEquip}/>
                            <SetEffect setEffect={setEffect} loading={!setEffect}/>
                        </TabsContent>

                        {/* 스킬 */}
                        <TabsContent value="skill" className="space-y-4">
                            <Skill skill={skill} loading={!skill}/>
                            <LinkSkill linkSkill={linkSkill} loading={!linkSkill}/>
                            <HexaStat hexaStat={hexaStat} loading={!hexaStat}/>
                            <HexaMatrix hexaMatrix={hexaMatrix} loading={!hexaMatrix}/>
                            <VMatrix vMatrix={vMatrix} loading={!vMatrix}/>
                        </TabsContent>

                        {/* 캐시 */}
                        <TabsContent value="cash" className="space-y-4">
                            <CashEquip equip={cashEquip} loading={!cashEquip}/>
                            <Beauty beauty={beauty} loading={!beauty}/>
                            <Android android={android} loading={!android}/>
                            <Pet pet={pet} loading={!pet}/>
                        </TabsContent>

                        {/* 기타 */}
                        <TabsContent value="etc" className="space-y-4">
                            <Dojang dojang={dojang} loading={!dojang}/>
                            <Ring ring={ring} loading={!ring}/>
                            <OtherStat otherStat={otherStat} loading={!otherStat}/>
                            <Propensity propensity={propensity} loading={!propensity}/>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterDetail;