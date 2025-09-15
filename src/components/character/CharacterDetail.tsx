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
import { findCharacterAbility, findCharacterAndroidEquipment, findCharacterBasic, findCharacterBeautyEquipment, findCharacterCashItemEquipment, findCharacterDojang, findCharacterHexaMatrix, findCharacterHexaMatrixStat, findCharacterHyperStat, findCharacterItemEquipment, findCharacterLinkSkill, findCharacterOtherStat, findCharacterPetEquipment, findCharacterPopularity, findCharacterPropensity, findCharacterRingExchange, findCharacterSetEffect, findCharacterSkill, findCharacterStat, findCharacterSymbolEquipment, findCharacterVMatrix, } from '@/fetchs/character.fetch';
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
    // 전체 로딩과 기본 정보 로딩을 분리하여
    // 먼저 받은 정보는 바로 화면에 표시하고
    // 이후 데이터는 순차적으로 받아오도록 한다.
    const [basicLoading, setBasicLoading] = useState(true);

    useEffect(() => {
        if (!ocid) return;

        const load = async () => {
            setBasicLoading(true);
            try {
                // 필수 정보
                const [basicRes, stat, popularity, hyper] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterStat(ocid),
                    findCharacterPopularity(ocid),
                    findCharacterHyperStat(ocid),
                ]);
                setBasic(basicRes.data)
                setStat(stat.data)
                setPopularity(popularity.data)
                setHyper(hyper.data)
                // 기본 정보가 준비되면 즉시 화면에 반영
                setBasicLoading(false);

                // 장비/스킬
                const grades = ["0", "1", "2", "3", "4", "5", "6", "hyperpassive", "hyperactive"]
                const [itemEquipRes, cashEquipRes, symbolEquipRes, setEffectRes, skillRes, linkSkillRes] =
                    await Promise.all([
                        findCharacterItemEquipment(ocid),
                        findCharacterCashItemEquipment(ocid),
                        findCharacterSymbolEquipment(ocid),
                        findCharacterSetEffect(ocid),
                        Promise.all(grades.map((g) => findCharacterSkill(ocid, g))),
                        findCharacterLinkSkill(ocid),
                    ]);
                setItemEquip(itemEquipRes.data)
                setCashEquip(cashEquipRes.data)
                setSymbolEquip(symbolEquipRes.data)
                setSetEffect(setEffectRes.data)
                setSkill(skillRes.map((s) => s.data))
                setLinkSkill(linkSkillRes.data)

                // 심화
                const [hexaMatrixRes, hexaStatRes, vMatrixRes, dojangRes, ringRes, otherStatRes] =
                    await Promise.all([
                        findCharacterHexaMatrix(ocid),
                        findCharacterHexaMatrixStat(ocid),
                        findCharacterVMatrix(ocid),
                        findCharacterDojang(ocid),
                        findCharacterRingExchange(ocid),
                        findCharacterOtherStat(ocid),
                    ]);
                setHexaMatrix(hexaMatrixRes.data)
                setHexaStat(hexaStatRes.data)
                setVMatrix(vMatrixRes.data)
                setDojang(dojangRes.data)
                setRing(ringRes.data)
                setOtherStat(otherStatRes.data)

                // 꾸미기/기타
                const [beautyRes, androidRes, petRes, propensityRes, abilityRes] = await Promise.all([
                    findCharacterBeautyEquipment(ocid),
                    findCharacterAndroidEquipment(ocid),
                    findCharacterPetEquipment(ocid),
                    findCharacterPropensity(ocid),
                    findCharacterAbility(ocid),
                ]);
                setBeauty(beautyRes.data)
                setAndroid(androidRes.data)
                setPet(petRes.data)
                setPropensity(propensityRes.data)
                setAbility(abilityRes.data)
            } catch (e) {
                console.error(e)
                toast.error('캐릭터 정보 로딩 실패');
            }
        };

        reset();
        load();
    }, [
        ocid,
        reset,
        setBasic,
        setStat,
        setPopularity,
        setHyper,
        setItemEquip,
        setCashEquip,
        setSymbolEquip,
        setSetEffect,
        setSkill,
        setLinkSkill,
        setHexaMatrix,
        setHexaStat,
        setVMatrix,
        setDojang,
        setRing,
        setOtherStat,
        setBeauty,
        setAndroid,
        setPet,
        setPropensity,
        setAbility,
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
                <div className="space-y-6 p-4 w-full max-w-xl mx-auto lg:max-w-3xl">
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

                    {/* 주요 스탯 */}
                    <Stat stat={stat} loading={basicLoading || !stat} />
                    <Popularity
                        popularity={popularity?.popularity}
                        loading={basicLoading || !popularity}
                    />
                    <HyperStat hyper={hyper} loading={basicLoading || !hyper} />

                    {/* 장비 */}
                    <ItemEquipments
                        items={itemEquip?.item_equipment || []}
                        loading={!itemEquip}
                    />

                    {/* 상세 정보 */}
                    {/* 스킬 등 */}
                    <CashEquip equip={cashEquip} loading={!cashEquip} />
                    <Skill skill={skill} loading={!skill} />
                    <SymbolEquip symbol={symbolEquip} loading={!symbolEquip} />
                    <SetEffect setEffect={setEffect} loading={!setEffect} />
                    <LinkSkill linkSkill={linkSkill} loading={!linkSkill} />

                    {/* 심화 */}
                    <HexaStat hexaStat={hexaStat} loading={!hexaStat} />
                    <HexaMatrix hexaMatrix={hexaMatrix} loading={!hexaMatrix} />
                    <VMatrix vMatrix={vMatrix} loading={!vMatrix} />
                    <Dojang dojang={dojang} loading={!dojang} />
                    <Ring ring={ring} loading={!ring} />
                    <OtherStat otherStat={otherStat} loading={!otherStat} />

                    {/* 꾸미기 / 기타 */}
                    <Beauty beauty={beauty} loading={!beauty} />
                    <Android android={android} loading={!android} />
                    <Pet pet={pet} loading={!pet} />
                    <Propensity propensity={propensity} loading={!propensity} />
                    <Ability ability={ability} loading={!ability} />
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterDetail;
