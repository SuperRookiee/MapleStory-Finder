"use client";

import React, { useEffect, useState } from "react";
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
  const { ocid } = params;
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
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
        router.back();
      }
    };
    load();
  }, [ocid, router]);

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

