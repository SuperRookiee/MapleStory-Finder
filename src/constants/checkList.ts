export type ChecklistBoss = {
    id: string;
    name: string;
    difficulty: "Normal" | "Hard" | "Chaos" | "Extreme" | "Easy" | "Hell";
    region: "Arcane" | "Grandis" | "Tenebris" | "Other";
    reward: number; // mesos
    weekly: boolean;
};

export type ChecklistBossGroup = {
    id: string;
    title: string;
    description: string;
    region: ChecklistBoss["region"];
    bosses: ChecklistBoss[];
};

const createBoss = (
    id: string,
    name: string,
    difficulty: ChecklistBoss["difficulty"],
    region: ChecklistBoss["region"],
    reward: number,
    weekly: boolean = true,
): ChecklistBoss => ({ id, name, difficulty, region, reward, weekly });

export const CHECKLIST_WEEKLY_BOSS_GROUPS: ChecklistBossGroup[] = [
    {
        id: "arcane-core",
        title: "Arcane River",
        description: "아케인 리버 지역의 주간 보스입니다.",
        region: "Arcane",
        bosses: [
            createBoss("damien-hard", "데미안", "Hard", "Arcane", 810_000_000),
            createBoss("lotus-hard", "스우", "Hard", "Arcane", 810_000_000),
            createBoss("lucid-hard", "루시드", "Hard", "Arcane", 1_040_000_000),
            createBoss("will-hard", "윌", "Hard", "Arcane", 1_040_000_000),
        ],
    },
    {
        id: "grandis-frontier",
        title: "Grandis Front",
        description: "그란디스 지역의 보스 진행 상황입니다.",
        region: "Grandis",
        bosses: [
            createBoss("guardian-angel-slime-chaos", "가디언 엔젤 슬라임", "Chaos", "Grandis", 1_120_000_000),
            createBoss("darknell-chaos", "다크넬", "Chaos", "Grandis", 1_200_000_000),
            createBoss("kalos-hard", "칼로스", "Hard", "Grandis", 1_420_000_000),
            createBoss("kaling-hard", "카링", "Hard", "Grandis", 1_620_000_000),
        ],
    },
    {
        id: "tenebris",
        title: "Tenebris",
        description: "테네브리스 지역의 보스 체크입니다.",
        region: "Tenebris",
        bosses: [
            createBoss("dusk-chaos", "더스크", "Chaos", "Tenebris", 1_100_000_000),
            createBoss("seren-hard", "세렌", "Hard", "Tenebris", 1_620_000_000),
            createBoss("verus-hilla-hard", "진 힐라", "Hard", "Tenebris", 940_000_000),
        ],
    },
];

export const BLACK_MAGE_BOSS = createBoss("black-mage", "검은마법사", "Extreme", "Other", 4_680_000_000, false);

export const WEEKLY_BOSS_MAP = CHECKLIST_WEEKLY_BOSS_GROUPS.flatMap((group) => group.bosses).reduce<
    Record<string, ChecklistBoss>
>((acc, boss) => {
    acc[boss.id] = boss;
    return acc;
}, {});

export const ALL_CHECKLIST_BOSSES = [...Object.values(WEEKLY_BOSS_MAP), BLACK_MAGE_BOSS];

export const getBossReward = (bossId: string) => WEEKLY_BOSS_MAP[bossId]?.reward ?? BLACK_MAGE_BOSS.reward;

export const getWeeklyBossCount = () => Object.keys(WEEKLY_BOSS_MAP).length;
