'use client'

import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition, useEffect, useState } from 'react';
import { toast } from "sonner";
import { HyperStat } from "@/components/character/detail/HyperStat";
import { Popularity } from "@/components/character/detail/Popularity";
import { Stat } from "@/components/character/detail/Stat";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ocid) return;

        const load = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
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
    }, [loading]);

    return (
        <ViewTransition enter="fade" exit="fade">
            <ScrollArea id="character-detail-scroll" className="h-page">
                <div className="space-y-6 p-4">
                    <div
                        className="relative w-80 h-80 mx-auto"
                        style={{
                            transform: `scale(${imageScale})`,
                            opacity: imageScale,
                        }}
                    >
                        {loading || !basic ? (
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
                    {loading || !basic ? (
                        <Skeleton className="h-6 w-40 mx-auto" />
                    ) : (
                        <p className="text-center font-bold mt-2">{basic.character_name}</p>
                    )}

                    {/* 주요 스탯 */}
                    <Stat stat={stat} loading={loading || !stat} />
                    <Popularity
                        popularity={popularity?.popularity}
                        loading={loading || !popularity}
                    />
                    <HyperStat hyper={hyper} loading={loading || !hyper} />

                    {/* 장비 */}
                    <ItemEquipments
                        items={itemEquip?.item_equipment || []}
                        loading={loading || !itemEquip}
                    />

                    {/* 상세 정보는 로딩 완료 후 표시 */}
                    {!loading && (
                        <>
                            {/* 스킬 등 - JSON 프리뷰 */}
                            {Object.entries({
                                cashEquip,
                                symbolEquip,
                                setEffect,
                                skill,
                                linkSkill,
                            }).map(([key, value]) => (
                                <section key={key} className="w-full">
                                    <h2 className="text-xl font-bold mb-2">{key}</h2>
                                    <pre className="text-sm bg-muted p-2 rounded overflow-x-auto max-w-full break-words whitespace-pre-wrap">
                                        {JSON.stringify(value, null, 2)}
                                    </pre>
                                </section>
                            ))}

                            {/* 심화 - JSON 프리뷰 */}
                            {Object.entries({
                                hexaMatrix,
                                hexaStat,
                                vMatrix,
                                dojang,
                                ring,
                                otherStat,
                            }).map(([key, value]) => (
                                <section key={key}>
                                    <h2 className="text-xl font-bold mb-2">{key}</h2>
                                    <pre className="text-sm bg-muted p-2 rounded overflow-x-auto max-w-full break-words whitespace-pre-wrap">
                                        {JSON.stringify(value, null, 2)}
                                    </pre>
                                </section>
                            ))}

                            {/* 꾸미기 / 기타 - JSON 프리뷰 */}
                            {Object.entries({
                                beauty,
                                android,
                                pet,
                                propensity,
                                ability,
                            }).map(([key, value]) => (
                                <section key={key}>
                                    <h2 className="text-xl font-bold mb-2">{key}</h2>
                                    <pre className="text-sm bg-muted p-2 rounded overflow-x-auto max-w-full break-words whitespace-pre-wrap">
                                        {JSON.stringify(value, null, 2)}
                                    </pre>
                                </section>
                            ))}
                        </>
                    )}
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterDetail;
