'use client'

import React, { useEffect, useState, unstable_ViewTransition as ViewTransition } from 'react';
import Image from 'next/image';
import {
    findCharacterBasic,
    findCharacterPopularity,
    findCharacterStat,
    findCharacterHyperStat,
    findCharacterPropensity,
    findCharacterAbility,
    findCharacterItemEquipment,
    findCharacterCashItemEquipment,
    findCharacterSymbolEquipment,
    findCharacterSetEffect,
    findCharacterBeautyEquipment,
    findCharacterAndroidEquipment,
    findCharacterPetEquipment,
    findCharacterSkill,
    findCharacterLinkSkill,
    findCharacterVMatrix,
    findCharacterHexaMatrix,
    findCharacterHexaMatrixStat,
    findCharacterDojang,
    findCharacterOtherStat,
    findCharacterRingExchange,
} from '@/fetch/character.fetch';

interface CharacterBasic {
    character_image?: string;
    character_name: string;
}

const CharacterDetail = ({ ocid }: { ocid: string }) => {
    const [data, setData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        if (!ocid) return;
        const load = async () => {
            try {
                const [
                    basic,
                    popularity,
                    stat,
                    hyper,
                    propensity,
                    ability,
                    itemEquip,
                    cashEquip,
                    symbolEquip,
                    setEffect,
                    beauty,
                    android,
                    pet,
                    skill,
                    linkSkill,
                    vMatrix,
                    hexaMatrix,
                    hexaStat,
                    dojang,
                    otherStat,
                    ring,
                ] = await Promise.all([
                    findCharacterBasic(ocid),
                    findCharacterPopularity(ocid),
                    findCharacterStat(ocid),
                    findCharacterHyperStat(ocid),
                    findCharacterPropensity(ocid),
                    findCharacterAbility(ocid),
                    findCharacterItemEquipment(ocid),
                    findCharacterCashItemEquipment(ocid),
                    findCharacterSymbolEquipment(ocid),
                    findCharacterSetEffect(ocid),
                    findCharacterBeautyEquipment(ocid),
                    findCharacterAndroidEquipment(ocid),
                    findCharacterPetEquipment(ocid),
                    findCharacterSkill(ocid),
                    findCharacterLinkSkill(ocid),
                    findCharacterVMatrix(ocid),
                    findCharacterHexaMatrix(ocid),
                    findCharacterHexaMatrixStat(ocid),
                    findCharacterDojang(ocid),
                    findCharacterOtherStat(ocid),
                    findCharacterRingExchange(ocid),
                ]);
                setData({
                    basic,
                    popularity,
                    stat,
                    hyper,
                    propensity,
                    ability,
                    itemEquip,
                    cashEquip,
                    symbolEquip,
                    setEffect,
                    beauty,
                    android,
                    pet,
                    skill,
                    linkSkill,
                    vMatrix,
                    hexaMatrix,
                    hexaStat,
                    dojang,
                    otherStat,
                    ring,
                });
            } catch {
                setData(null);
            }
        };
        load();
    }, [ocid]);

    if (!data) return <div className="p-4">Loading...</div>;

    const basic = data.basic as CharacterBasic;

    return (
        <ViewTransition enter="fade" exit="fade">
            <div className="p-4 space-y-6">
                {basic?.character_image && (
                    <div className="relative w-64 h-64 mx-auto">
                        <Image
                            src={basic.character_image}
                            alt={basic.character_name}
                            fill
                            className="object-contain"
                            style={{ viewTransitionName: `character-image-${ocid}` }}
                            sizes="256px"
                        />
                    </div>
                )}
                {Object.entries(data).map(([key, value]) => (
                    <section key={key}>
                        <h2 className="text-xl font-bold mb-2">{key}</h2>
                        <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
                    </section>
                ))}
            </div>
        </ViewTransition>
    );
}

export default CharacterDetail;
