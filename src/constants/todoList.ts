export type BossFrequency = "daily" | "weekly" | "monthly";

export type BossPriceEntry = {
    id: string;
    label: string;
    boss: string;
    difficulty: "Easy" | "Normal" | "Hard" | "Chaos" | "Extreme";
    price: number;
    frequency: BossFrequency;
    ratioToLowerDifficulty?: number;
};

export const BOSS_PRICE_TABLE: BossPriceEntry[] = [
    { id: "cygnus-easy", label: "이지 시그너스", boss: "시그너스", difficulty: "Easy", price: 4_550_000, frequency: "daily" },
    { id: "hilla-hard", label: "하드 힐라", boss: "힐라", difficulty: "Hard", price: 5_750_000, frequency: "daily" },
    {
        id: "pink-bean-chaos",
        label: "카오스 핑크빈",
        boss: "핑크빈",
        difficulty: "Chaos",
        price: 6_580_000,
        frequency: "daily",
    },
    {
        id: "cygnus-normal",
        label: "노멀 시그너스",
        boss: "시그너스",
        difficulty: "Normal",
        price: 7_500_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.65,
    },
    {
        id: "zakum-chaos",
        label: "카오스 자쿰",
        boss: "자쿰",
        difficulty: "Chaos",
        price: 8_080_000,
        frequency: "weekly",
    },
    {
        id: "bloody-queen-chaos",
        label: "카오스 블러디퀸",
        boss: "블러디퀸",
        difficulty: "Chaos",
        price: 8_140_000,
        frequency: "weekly",
    },
    {
        id: "banban-chaos",
        label: "카오스 반반",
        boss: "반반",
        difficulty: "Chaos",
        price: 8_150_000,
        frequency: "weekly",
    },
    {
        id: "pierre-chaos",
        label: "카오스 피에르",
        boss: "피에르",
        difficulty: "Chaos",
        price: 8_170_000,
        frequency: "weekly",
    },
    {
        id: "magnus-hard",
        label: "하드 매그너스",
        boss: "매그너스",
        difficulty: "Hard",
        price: 8_560_000,
        frequency: "weekly",
    },
    {
        id: "vellum-chaos",
        label: "카오스 벨룸",
        boss: "벨룸",
        difficulty: "Chaos",
        price: 9_280_000,
        frequency: "weekly",
    },
    {
        id: "papulatus-chaos",
        label: "카오스 파풀라투스",
        boss: "파풀라투스",
        difficulty: "Chaos",
        price: 17_300_000,
        frequency: "weekly",
    },
    {
        id: "suu-normal",
        label: "노멀 스우",
        boss: "스우",
        difficulty: "Normal",
        price: 22_000_000,
        frequency: "weekly",
    },
    {
        id: "demian-normal",
        label: "노멀 데미안",
        boss: "데미안",
        difficulty: "Normal",
        price: 23_000_000,
        frequency: "weekly",
    },
    {
        id: "guardian-angel-slime-normal",
        label: "노멀 가디언 엔젤 슬라임",
        boss: "가디언 엔젤 슬라임",
        difficulty: "Normal",
        price: 33_500_000,
        frequency: "weekly",
    },
    {
        id: "lucid-easy",
        label: "이지 루시드",
        boss: "루시드",
        difficulty: "Easy",
        price: 39_200_000,
        frequency: "weekly",
    },
    {
        id: "will-easy",
        label: "이지 윌",
        boss: "윌",
        difficulty: "Easy",
        price: 42_500_000,
        frequency: "weekly",
    },
    {
        id: "lucid-normal",
        label: "노멀 루시드",
        boss: "루시드",
        difficulty: "Normal",
        price: 46_900_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.2,
    },
    {
        id: "will-normal",
        label: "노멀 윌",
        boss: "윌",
        difficulty: "Normal",
        price: 54_100_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.27,
    },
    {
        id: "dusk-normal",
        label: "노멀 더스크",
        boss: "더스크",
        difficulty: "Normal",
        price: 57_900_000,
        frequency: "weekly",
    },
    {
        id: "dunkel-normal",
        label: "노멀 듄켈",
        boss: "듄켈",
        difficulty: "Normal",
        price: 62_500_000,
        frequency: "weekly",
    },
    {
        id: "demian-hard",
        label: "하드 데미안",
        boss: "데미안",
        difficulty: "Hard",
        price: 73_500_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 3.43,
    },
    {
        id: "suu-hard",
        label: "하드 스우",
        boss: "스우",
        difficulty: "Hard",
        price: 77_400_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 3.79,
    },
    {
        id: "lucid-hard",
        label: "하드 루시드",
        boss: "루시드",
        difficulty: "Hard",
        price: 94_500_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 2.3,
    },
    {
        id: "dusk-chaos",
        label: "카오스 더스크",
        boss: "더스크",
        difficulty: "Chaos",
        price: 105_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.81,
    },
    {
        id: "jin-hilla-normal",
        label: "노멀 진 힐라",
        boss: "진 힐라",
        difficulty: "Normal",
        price: 107_000_000,
        frequency: "weekly",
    },
    {
        id: "guardian-angel-slime-chaos",
        label: "카오스 가디언 엔젤 슬라임",
        boss: "가디언 엔젤 슬라임",
        difficulty: "Chaos",
        price: 113_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 3.37,
    },
    {
        id: "will-hard",
        label: "하드 윌",
        boss: "윌",
        difficulty: "Hard",
        price: 116_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 2.44,
    },
    {
        id: "dunkel-hard",
        label: "하드 듄켈",
        boss: "듄켈",
        difficulty: "Hard",
        price: 142_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 2.27,
    },
    {
        id: "jin-hilla-hard",
        label: "하드 진 힐라",
        boss: "진 힐라",
        difficulty: "Hard",
        price: 160_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.31,
    },
    {
        id: "seren-normal",
        label: "노멀 선택받은 세렌",
        boss: "선택받은 세렌",
        difficulty: "Normal",
        price: 295_000_000,
        frequency: "weekly",
    },
    {
        id: "kalos-easy",
        label: "이지 감시자 칼로스",
        boss: "감시자 칼로스",
        difficulty: "Easy",
        price: 345_000_000,
        frequency: "weekly",
    },
    {
        id: "daejeokja-easy",
        label: "이지 최초의 대적자",
        boss: "최초의 대적자",
        difficulty: "Easy",
        price: 361_000_000,
        frequency: "weekly",
    },
    {
        id: "kaling-easy",
        label: "이지 카링",
        boss: "카링",
        difficulty: "Easy",
        price: 381_000_000,
        frequency: "weekly",
    },
    {
        id: "seren-hard",
        label: "하드 선택받은 세렌",
        boss: "선택받은 세렌",
        difficulty: "Hard",
        price: 440_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.49,
    },
    {
        id: "kalos-normal",
        label: "노멀 감시자 칼로스",
        boss: "감시자 칼로스",
        difficulty: "Normal",
        price: 510_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.48,
    },
    {
        id: "daejeokja-normal",
        label: "노멀 최초의 대적자",
        boss: "최초의 대적자",
        difficulty: "Normal",
        price: 530_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.46,
    },
    {
        id: "suu-extreme",
        label: "익스트림 스우",
        boss: "스우",
        difficulty: "Extreme",
        price: 549_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 24.95,
    },
    {
        id: "kaling-normal",
        label: "노멀 카링",
        boss: "카링",
        difficulty: "Normal",
        price: 595_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.56,
    },
    {
        id: "limbo-normal",
        label: "노멀 림보",
        boss: "림보",
        difficulty: "Normal",
        price: 900_000_000,
        frequency: "weekly",
    },
    {
        id: "kalos-chaos",
        label: "카오스 감시자 칼로스",
        boss: "감시자 칼로스",
        difficulty: "Chaos",
        price: 1_120_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 3.25,
    },
    {
        id: "baldrix-normal",
        label: "노멀 발드릭스",
        boss: "발드릭스",
        difficulty: "Normal",
        price: 1_200_000_000,
        frequency: "weekly",
    },
    {
        id: "daejeokja-hard",
        label: "하드 최초의 대적자",
        boss: "최초의 대적자",
        difficulty: "Hard",
        price: 1_260_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 3.49,
    },
    {
        id: "kaling-hard",
        label: "하드 카링",
        boss: "카링",
        difficulty: "Hard",
        price: 1_310_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 3.44,
    },
    {
        id: "limbo-hard",
        label: "하드 림보",
        boss: "림보",
        difficulty: "Hard",
        price: 1_930_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 2.14,
    },
    {
        id: "baldrix-hard",
        label: "하드 발드릭스",
        boss: "발드릭스",
        difficulty: "Hard",
        price: 2_160_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 1.8,
    },
    {
        id: "seren-extreme",
        label: "익스트림 선택받은 세렌",
        boss: "선택받은 세렌",
        difficulty: "Extreme",
        price: 2_420_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 8.2,
    },
    {
        id: "kalos-extreme",
        label: "익스트림 감시자 칼로스",
        boss: "감시자 칼로스",
        difficulty: "Extreme",
        price: 2_700_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 7.83,
    },
    {
        id: "daejeokja-extreme",
        label: "익스트림 최초의 대적자",
        boss: "최초의 대적자",
        difficulty: "Extreme",
        price: 2_920_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 8.08,
    },
    {
        id: "kaling-extreme",
        label: "익스트림 카링",
        boss: "카링",
        difficulty: "Extreme",
        price: 3_150_000_000,
        frequency: "weekly",
        ratioToLowerDifficulty: 8.27,
    },
    {
        id: "black-mage-hard",
        label: "하드 검은 마법사",
        boss: "검은 마법사",
        difficulty: "Hard",
        price: 1_000_000_000,
        frequency: "monthly",
    },
    {
        id: "black-mage-extreme",
        label: "익스트림 검은 마법사",
        boss: "검은 마법사",
        difficulty: "Extreme",
        price: 9_200_000_000,
        frequency: "monthly",
        ratioToLowerDifficulty: 9.2,
    },
];

export const BOSS_PRICE_BY_ID = BOSS_PRICE_TABLE.reduce<Record<string, BossPriceEntry>>((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
}, {});

export type TodoListBoss = {
    id: string;
    name: string;
    difficulty: BossPriceEntry["difficulty"];
    region: "Legacy" | "Arcane" | "Grandis" | "Other";
    reward: number; // mesos
    frequency: BossFrequency;
};

export type TodoListBossGroup = {
    id: string;
    title: string;
    description: string;
    region: TodoListBoss["region"];
    bosses: TodoListBoss[];
};

const createBoss = (priceId: BossPriceEntry["id"], region: TodoListBoss["region"], frequency: BossFrequency = "weekly"): TodoListBoss => {
    const entry = BOSS_PRICE_BY_ID[priceId];
    return {
        id: entry.id,
        name: entry.label,
        difficulty: entry.difficulty,
        region,
        reward: entry.price,
        frequency,
    };
};

export const TODO_LIST_WEEKLY_BOSS_GROUPS: TodoListBossGroup[] = [
    {
        id: "legacy-weekly",
        title: "Legacy Bosses",
        description: "과거 지역의 주간 보스입니다.",
        region: "Legacy",
        bosses: [
            createBoss("cygnus-normal", "Legacy"),
            createBoss("zakum-chaos", "Legacy"),
            createBoss("bloody-queen-chaos", "Legacy"),
            createBoss("banban-chaos", "Legacy"),
            createBoss("pierre-chaos", "Legacy"),
            createBoss("magnus-hard", "Legacy"),
            createBoss("vellum-chaos", "Legacy"),
            createBoss("papulatus-chaos", "Legacy"),
        ],
    },
    {
        id: "arcane-river",
        title: "Arcane River",
        description: "아케인 리버 지역의 주간 보스입니다.",
        region: "Arcane",
        bosses: [
            createBoss("suu-normal", "Arcane"),
            createBoss("demian-normal", "Arcane"),
            createBoss("guardian-angel-slime-normal", "Arcane"),
            createBoss("lucid-easy", "Arcane"),
            createBoss("will-easy", "Arcane"),
            createBoss("lucid-normal", "Arcane"),
            createBoss("will-normal", "Arcane"),
            createBoss("dusk-normal", "Arcane"),
            createBoss("dunkel-normal", "Arcane"),
            createBoss("demian-hard", "Arcane"),
            createBoss("suu-hard", "Arcane"),
            createBoss("lucid-hard", "Arcane"),
            createBoss("dusk-chaos", "Arcane"),
            createBoss("jin-hilla-normal", "Arcane"),
            createBoss("guardian-angel-slime-chaos", "Arcane"),
            createBoss("will-hard", "Arcane"),
            createBoss("dunkel-hard", "Arcane"),
            createBoss("jin-hilla-hard", "Arcane"),
            createBoss("suu-extreme", "Arcane"),
        ],
    },
    {
        id: "grandis-frontier",
        title: "Grandis Front",
        description: "그란디스 지역의 보스 진행 상황입니다.",
        region: "Grandis",
        bosses: [
            createBoss("seren-normal", "Grandis"),
            createBoss("kalos-easy", "Grandis"),
            createBoss("daejeokja-easy", "Grandis"),
            createBoss("kaling-easy", "Grandis"),
            createBoss("seren-hard", "Grandis"),
            createBoss("kalos-normal", "Grandis"),
            createBoss("daejeokja-normal", "Grandis"),
            createBoss("kaling-normal", "Grandis"),
            createBoss("limbo-normal", "Grandis"),
            createBoss("kalos-chaos", "Grandis"),
            createBoss("baldrix-normal", "Grandis"),
            createBoss("daejeokja-hard", "Grandis"),
            createBoss("kaling-hard", "Grandis"),
            createBoss("limbo-hard", "Grandis"),
            createBoss("baldrix-hard", "Grandis"),
            createBoss("seren-extreme", "Grandis"),
            createBoss("kalos-extreme", "Grandis"),
            createBoss("daejeokja-extreme", "Grandis"),
            createBoss("kaling-extreme", "Grandis"),
        ],
    },
];

export const BLACK_MAGE_BOSS = createBoss("black-mage-hard", "Other", "monthly");

export const WEEKLY_BOSS_MAP = TODO_LIST_WEEKLY_BOSS_GROUPS.flatMap((group) => group.bosses).reduce<
    Record<string, TodoListBoss>
>((acc, boss) => {
    acc[boss.id] = boss;
    return acc;
}, {});

export const ALL_TODO_LIST_BOSSES = [...Object.values(WEEKLY_BOSS_MAP), BLACK_MAGE_BOSS];

export const getBossReward = (bossId: string) => WEEKLY_BOSS_MAP[bossId]?.reward ?? BLACK_MAGE_BOSS.reward;

export const getWeeklyBossCount = () => Object.keys(WEEKLY_BOSS_MAP).length;
