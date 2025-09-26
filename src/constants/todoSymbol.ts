export type TodoSymbolRegion = "arcane-river" | "grandis";

export type TodoSymbolFrequency = "daily" | "weekly";

export type TodoSymbolQuest = {
    id: string;
    name: string;
    area: string;
    reward?: string;
    region: TodoSymbolRegion;
    frequency: TodoSymbolFrequency;
};

export const TODO_SYMBOL_QUESTS: TodoSymbolQuest[] = [
    {
        id: "arcane-vanishing-journey",
        name: "아케인심볼: 소멸의 여로",
        area: "소멸의 여로",
        region: "arcane-river",
        frequency: "daily",
    },
    {
        id: "arcane-chuchu-island",
        name: "아케인심볼: 츄츄 아일랜드",
        area: "츄츄 아일랜드",
        region: "arcane-river",
        frequency: "daily",
    },
    {
        id: "arcane-lachelein",
        name: "아케인심볼: 레헬른",
        area: "꿈의 도시 레헬른",
        region: "arcane-river",
        frequency: "daily",
    },
    {
        id: "arcane-arcana",
        name: "아케인심볼: 아르카나",
        area: "신비의 숲 아르카나",
        region: "arcane-river",
        frequency: "daily",
    },
    {
        id: "arcane-moras",
        name: "아케인심볼: 모라스",
        area: "기억의 늪 모라스",
        region: "arcane-river",
        frequency: "daily",
    },
    {
        id: "arcane-esfera",
        name: "아케인심볼: 에스페라",
        area: "태초의 바다 에스페라",
        region: "arcane-river",
        frequency: "daily",
    },
    {
        id: "grandis-cernium",
        name: "세르니움 조사",
        area: "세르니움",
        reward: "⬢30~50",
        region: "grandis",
        frequency: "weekly",
    },
    {
        id: "grandis-hotel-arcus",
        name: "호텔 아르크스 주변 청소",
        area: "호텔 아르크스",
        reward: "⬢70~100",
        region: "grandis",
        frequency: "weekly",
    },
    {
        id: "grandis-odium",
        name: "오디움 일대 탐사",
        area: "오디움",
        reward: "⬢130~200",
        region: "grandis",
        frequency: "weekly",
    },
    {
        id: "grandis-shangri-la",
        name: "도원경 오염 정화",
        area: "도원경",
        reward: "⬢230~300",
        region: "grandis",
        frequency: "weekly",
    },
    {
        id: "grandis-arteria",
        name: "아르테리아 잔당 처치",
        area: "아르테리아",
        reward: "⬢330~400",
        region: "grandis",
        frequency: "weekly",
    },
    {
        id: "grandis-carcion",
        name: "카르시온 복구 지원",
        area: "카르시온",
        reward: "⬢430~500",
        region: "grandis",
        frequency: "weekly",
    },
    {
        id: "grandis-talahart",
        name: "탈라하트 고대신의 힘 조사",
        area: "탈라하트",
        reward: "⬢630~700",
        region: "grandis",
        frequency: "weekly",
    },
];

export const TODO_SYMBOL_QUEST_IDS = TODO_SYMBOL_QUESTS.map((quest) => quest.id);

export const TODO_SYMBOL_REGION_ORDER: TodoSymbolRegion[] = ["arcane-river", "grandis"];
