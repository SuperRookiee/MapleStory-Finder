'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// 장비 슬롯 위치 (col, row)
const slotPosition: Record<string, { col: number; row: number }> = {
    "무기": { col: 2, row: 4 },
    "보조무기": { col: 5, row: 4 },
    "엠블렘": { col: 5, row: 1 },

    "모자": { col: 3, row: 1 },
    "상의": { col: 3, row: 4 },
    "하의": { col: 3, row: 5 },

    "어깨장식": { col: 4, row: 4 },
    "장갑": { col: 4, row: 5 },
    "신발": { col: 3, row: 6 },
    "망토": { col: 5, row: 5 },

    "얼굴장식": { col: 3, row: 2 },
    "눈장식": { col: 3, row: 3 },
    "귀고리": { col: 4, row: 3 },
    "벨트": { col: 2, row: 5 },
    "펜던트": { col: 2, row: 2 },
    "펜던트2": { col: 2, row: 3 },

    "반지1": { col: 1, row: 4 },
    "반지2": { col: 1, row: 3 },
    "반지3": { col: 1, row: 2 },
    "반지4": { col: 1, row: 1 },

    "포켓 아이템": { col: 1, row: 5 },
    "기계 심장": { col: 5, row: 6 },
    "뱃지": { col: 5, row: 2 },
    "훈장": { col: 5, row: 3 },
};

const ItemEquipmentsSkeleton = () => (
    <Card>
        <CardHeader>
            <CardTitle>장비</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
            <div className="grid grid-cols-5 grid-rows-6 gap-2 p-4 bg-muted rounded-lg w-[420px]">
                {Object.entries(slotPosition).map(([slot, pos]) => (
                    <div
                        key={slot}
                        className="w-14 h-14 p-2 border rounded-md flex items-center justify-center bg-card"
                        style={{ gridColumnStart: pos.col, gridRowStart: pos.row }}
                    >
                        <Skeleton className="w-10 h-10" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default ItemEquipmentsSkeleton;

