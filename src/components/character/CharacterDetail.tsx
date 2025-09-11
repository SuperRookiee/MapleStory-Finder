'use client'

import React, { unstable_ViewTransition as ViewTransition, useEffect, useState } from 'react';
import Image from 'next/image';
import { findCharacterAbility, findCharacterAndroidEquipment, findCharacterBasic, findCharacterBeautyEquipment, findCharacterCashItemEquipment, findCharacterDojang, findCharacterHexaMatrix, findCharacterHexaMatrixStat, findCharacterHyperStat, findCharacterItemEquipment, findCharacterLinkSkill, findCharacterOtherStat, findCharacterPetEquipment, findCharacterPopularity, findCharacterPropensity, findCharacterRingExchange, findCharacterSetEffect, findCharacterSkill, findCharacterStat, findCharacterSymbolEquipment, findCharacterVMatrix, } from '@/fetchs/character.fetch';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/character/card/StatCard";
import { PopularityCard } from "@/components/character/card/PopularityCard";
import { HyperStatCard } from "@/components/character/card/HyperStatCard";
import { IStage1Data, IStage2Data, IStage3Data, IStage4Data } from "@/interface/character";
import { ICharacterResponse } from "@/interface/ICharacterResponse";

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const [basic, setBasic] = useState<Pick<ICharacterResponse, 'character_image' | 'character_name'> | null>(null);
    const [stage1, setStage1] = useState<IStage1Data>({})
    const [stage2, setStage2] = useState<IStage2Data>({})
    const [stage3, setStage3] = useState<IStage3Data>({})
    const [stage4, setStage4] = useState<IStage4Data>({})

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
                setBasic(basicRes);
                setStage1({ stat, popularity, hyper });

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
                setStage2({ itemEquip, cashEquip, symbolEquip, setEffect, skill, linkSkill });

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
                setStage3({ hexaMatrix, hexaStat, vMatrix, dojang, ring, otherStat });

                // 꾸미기/기타
                const [beauty, android, pet, propensity, ability] = await Promise.all([
                    findCharacterBeautyEquipment(ocid),
                    findCharacterAndroidEquipment(ocid),
                    findCharacterPetEquipment(ocid),
                    findCharacterPropensity(ocid),
                    findCharacterAbility(ocid),
                ]);
                setStage4({ beauty, android, pet, propensity, ability });
            } catch (err) {
                console.error('캐릭터 정보 로딩 실패:', err);
            }
        };

        load();
    }, [ocid]);

    return (
        <ViewTransition enter="fade" exit="fade">
            <ScrollArea className="h-page">
                <div className="space-y-6">
                    {/* 캐릭터 기본 정보 */}
                    {basic ? (
                        <div className="relative w-64 h-64 mx-auto">
                            {basic.character_image && (
                                <Image
                                    src={basic.character_image}
                                    alt={basic.character_name}
                                    fill
                                    className="object-contain"
                                    style={{ viewTransitionName: `character-image-${ocid}` }}
                                    sizes="256px"
                                />
                            )}
                            <p className="text-center font-bold mt-2">{basic.character_name}</p>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-page">
                            <Spinner/>
                        </div>
                    )}

                    {/* 1단계 : 주요 스탯 */}
                    {stage1.stat && <StatCard stat={stage1.stat}/>}
                    {stage1.popularity && <PopularityCard popularity={stage1.popularity.popularity}/>}
                    {stage1.hyper && <HyperStatCard hyper={stage1.hyper}/>}

                    {/* 2단계 ~ 4단계는 아직 카드 UI 안만들었으므로 JSON 프리뷰 */}
                    {Object.entries(stage2).map(([key, value]) => (
                        <section key={key}>
                            <h2 className="text-xl font-bold mb-2">{key}</h2>
                            <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        </section>
                    ))}

                    {Object.entries(stage3).map(([key, value]) => (
                        <section key={key}>
                            <h2 className="text-xl font-bold mb-2">{key}</h2>
                            <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        </section>
                    ))}

                    {Object.entries(stage4).map(([key, value]) => (
                        <section key={key}>
                            <h2 className="text-xl font-bold mb-2">{key}</h2>
                            <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        </section>
                    ))}
                </div>
            </ScrollArea>
        </ViewTransition>
    );
};

export default CharacterDetail;