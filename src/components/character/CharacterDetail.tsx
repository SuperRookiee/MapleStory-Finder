'use client'

import React, { unstable_ViewTransition as ViewTransition, useEffect, useState } from 'react';
import Image from 'next/image';
import { findCharacterAbility, findCharacterAndroidEquipment, findCharacterBasic, findCharacterBeautyEquipment, findCharacterCashItemEquipment, findCharacterDojang, findCharacterHexaMatrix, findCharacterHexaMatrixStat, findCharacterHyperStat, findCharacterItemEquipment, findCharacterLinkSkill, findCharacterOtherStat, findCharacterPetEquipment, findCharacterPopularity, findCharacterPropensity, findCharacterRingExchange, findCharacterSetEffect, findCharacterSkill, findCharacterStat, findCharacterSymbolEquipment, findCharacterVMatrix, } from '@/fetchs/character.fetch';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/character/card/StatCard";
import { PopularityCard } from "@/components/character/card/PopularityCard";
import { HyperStatCard } from "@/components/character/card/HyperStatCard";
import { JsonCard } from "@/components/character/card/JsonCard";
import { characterDetailStore } from "@/store/characterDetailStore";
import { toast } from "sonner";

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const {
        basic, stat, popularity, hyper,
        itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill,
        hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat,
        beauty, android, pet, propensity, ability,
        setBasic, setStat, setPopularity, setHyper,
        setItemEquip, setCashEquip, setSymbolEquip, setSetEffect, setSkill, setLinkSkill,
        setHexaMatrix, setHexaStat, setVMatrix, setDojang, setRing, setOtherStat,
        setBeauty, setAndroid, setPet, setPropensity, setAbility
    } = characterDetailStore()
    const [imageScale, setImageScale] = useState(1);

    useEffect(() => {
        if (!ocid) return;

        const load = async () => {
            try {
                // 필수 정보
                const [basicRes, stat, popularity, hyper] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterStat(ocid),
                    findCharacterPopularity(ocid),
                    findCharacterHyperStat(ocid),
                ]);
                setBasic(basicRes)
                setStat(stat)
                setPopularity(popularity)
                setHyper(hyper)

                // 장비/스킬
                const grades = ["0", "1", "2", "3", "4", "5", "6", "hyperpassive", "hyperactive"]
                const [itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill] =
                    await Promise.all([
                        findCharacterItemEquipment(ocid),
                        findCharacterCashItemEquipment(ocid),
                        findCharacterSymbolEquipment(ocid),
                        findCharacterSetEffect(ocid),
                        Promise.all(grades.map((g) => findCharacterSkill(ocid, g))),
                        findCharacterLinkSkill(ocid),
                    ]);
                setItemEquip(itemEquip)
                setCashEquip(cashEquip)
                setSymbolEquip(symbolEquip)
                setSetEffect(setEffect)
                setSkill(skill)
                setLinkSkill(linkSkill)

                // 심화
                const [hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat] =
                    await Promise.all([
                        findCharacterHexaMatrix(ocid),
                        findCharacterHexaMatrixStat(ocid),
                        findCharacterVMatrix(ocid),
                        findCharacterDojang(ocid),
                        findCharacterRingExchange(ocid),
                        findCharacterOtherStat(ocid),
                    ]);
                setHexaMatrix(hexaMatrix)
                setHexaStat(hexaStat)
                setVMatrix(vMatrix)
                setDojang(dojang)
                setRing(ring)
                setOtherStat(otherStat)

                // 꾸미기/기타
                const [beauty, android, pet, propensity, ability] = await Promise.all([
                    findCharacterBeautyEquipment(ocid),
                    findCharacterAndroidEquipment(ocid),
                    findCharacterPetEquipment(ocid),
                    findCharacterPropensity(ocid),
                    findCharacterAbility(ocid),
                ]);
                setBeauty(beauty)
                setAndroid(android)
                setPet(pet)
                setPropensity(propensity)
                setAbility(ability)
            } catch (e) {
                console.error(e)
                toast.error('캐릭터 정보 로딩 실패');
            }
        };

        load();
    }, [ocid]);

    useEffect(() => {
        const viewport = document.querySelector(
            '#character-detail-scroll [data-slot="scroll-area-viewport"]'
        ) as HTMLElement | null;
        if (!viewport) return;
        const handleScroll = () => {
            const top = viewport.scrollTop;
            const progress = Math.min(top / 200, 1);
            setImageScale(1 - progress);
        };
        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ViewTransition enter="fade" exit="fade">
            <ScrollArea id="character-detail-scroll" className="h-page">
                <div className="space-y-6">
                    {/* 캐릭터 기본 정보 */}
                    {basic ? (
                        <div
                            className="relative w-80 h-80 mx-auto transition-all duration-300"
                            style={{
                                transform: `scale(${imageScale})`,
                                opacity: imageScale,
                            }}
                        >
                            {basic.character_image && (
                                <Image
                                    src={basic.character_image}
                                    alt={basic.character_name}
                                    fill
                                    className="object-contain"
                                    style={{ viewTransitionName: `character-image-${ocid}` }}
                                    sizes="320px"
                                />
                            )}
                            <p className="text-center font-bold mt-2">{basic.character_name}</p>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-page">
                            <Spinner/>
                        </div>
                    )}

                    {/* 주요 스탯 */}
                    {stat && <StatCard stat={stat}/>}
                    {popularity && <PopularityCard popularity={popularity.popularity}/>}
                    {hyper && <HyperStatCard hyper={hyper}/>}

                    {/* 장비 / 스킬 */}
                    {Object.entries({
                        itemEquip,
                        cashEquip,
                        symbolEquip,
                        setEffect,
                        skill,
                        linkSkill,
                    }).map(([key, value]) => (
                        <JsonCard key={key} title={key} data={value} />
                    ))}

                    {/* 심화 */}
                    {Object.entries({
                        hexaMatrix,
                        hexaStat,
                        vMatrix,
                        dojang,
                        ring,
                        otherStat,
                    }).map(([key, value]) => (
                        <JsonCard key={key} title={key} data={value} />
                    ))}

                    {/* 꾸미기 / 기타 */}
                    {Object.entries({
                        beauty,
                        android,
                        pet,
                        propensity,
                        ability,
                    }).map(([key, value]) => (
                        <JsonCard key={key} title={key} data={value} />
                    ))}
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterDetail;
