'use client'

import React, { unstable_ViewTransition as ViewTransition, useEffect } from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/character/card/StatCard";
import { PopularityCard } from "@/components/character/card/PopularityCard";
import { HyperStatCard } from "@/components/character/card/HyperStatCard";
import { useCharacterStore } from "@/store/characterStore";

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const {
        basic,
        stage1,
        stage2,
        stage3,
        stage4,
        loadCharacter,
        reset,
    } = useCharacterStore();

    useEffect(() => {
        loadCharacter(ocid);
        return () => reset();
    }, [ocid, loadCharacter, reset]);

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