"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "@/fetch/character.fetch";

export default function CharacterDetail({ params }: { params: { ocid: string } }) {
    const router = useRouter();
    const [data, setData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [basic, popularity, stat, hyper, propensity, ability, itemEquip, cashEquip, symbolEquip, setEffect, beauty, android, pet, skill, linkSkill, vMatrix, hexaMatrix, hexaStat, dojang, otherStat, ring] = await Promise.all([
                    findCharacterBasic(params.ocid),
                    findCharacterPopularity(params.ocid),
                    findCharacterStat(params.ocid),
                    findCharacterHyperStat(params.ocid),
                    findCharacterPropensity(params.ocid),
                    findCharacterAbility(params.ocid),
                    findCharacterItemEquipment(params.ocid),
                    findCharacterCashItemEquipment(params.ocid),
                    findCharacterSymbolEquipment(params.ocid),
                    findCharacterSetEffect(params.ocid),
                    findCharacterBeautyEquipment(params.ocid),
                    findCharacterAndroidEquipment(params.ocid),
                    findCharacterPetEquipment(params.ocid),
                    findCharacterSkill(params.ocid),
                    findCharacterLinkSkill(params.ocid),
                    findCharacterVMatrix(params.ocid),
                    findCharacterHexaMatrix(params.ocid),
                    findCharacterHexaMatrixStat(params.ocid),
                    findCharacterDojang(params.ocid),
                    findCharacterOtherStat(params.ocid),
                    findCharacterRingExchange(params.ocid),
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
                router.back();
            }
        };
        load();
    }, [params.ocid, router]);

    if (!data) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4 space-y-6">
            {Object.entries(data).map(([key, value]) => (
                <section key={key}>
                    <h2 className="text-xl font-bold mb-2">{key}</h2>
                    <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                    </pre>
                </section>
            ))}
        </div>
    );
}
