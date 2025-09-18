import { JobInfo, JobStat, LocalizedText } from "@/interface/job/IJobInfo";

export type JobRootCategory =
    | "모험가"
    | "시그너스 기사단"
    | "영웅"
    | "레지스탕스"
    | "노바"
    | "레프"
    | "아니마"
    | "기타";

export type JobBranch = "전사" | "마법사" | "궁수" | "도적" | "해적" | "공용";

const job = (
    ko: string,
    en: string,
    mainStat: JobStat[],
    subStat?: JobStat[],
    aliases: string[] = [],
): JobInfo => ({
    name: { ko, en },
    mainStat,
    ...(subStat ? { subStat } : {}),
    ...(aliases.length ? { aliases } : {}),
});

export const JOB_ROOT_CATEGORY_LABELS: Record<JobRootCategory, LocalizedText> = {
    모험가: { ko: "모험가", en: "Explorers" },
    "시그너스 기사단": { ko: "시그너스 기사단", en: "Cygnus Knights" },
    영웅: { ko: "영웅", en: "Heroes" },
    레지스탕스: { ko: "레지스탕스", en: "Resistance" },
    노바: { ko: "노바", en: "Nova" },
    레프: { ko: "레프", en: "Lef" },
    아니마: { ko: "아니마", en: "Anima" },
    기타: { ko: "기타", en: "Others" },
};

export const JOB_BRANCH_LABELS: Record<JobBranch, LocalizedText> = {
    전사: { ko: "전사", en: "Warrior" },
    마법사: { ko: "마법사", en: "Mage" },
    궁수: { ko: "궁수", en: "Archer" },
    도적: { ko: "도적", en: "Thief" },
    해적: { ko: "해적", en: "Pirate" },
    공용: { ko: "공용", en: "Universal" },
};

export const JOBS: Record<JobRootCategory, Record<JobBranch, JobInfo[]>> = {
    모험가: {
        전사: [
            job("히어로", "Hero", ["STR"], ["DEX"]),
            job("팔라딘", "Paladin", ["STR"], ["DEX"]),
            job("다크나이트", "Dark Knight", ["STR"], ["DEX"]),
        ],
        마법사: [
            job("아크메이지(불,독)", "Arch Mage (Fire, Poison)", ["INT"], ["LUK"], ["Fire/Poison Arch Mage", "F/P Arch Mage"]),
            job("아크메이지(썬,콜)", "Arch Mage (Ice, Lightning)", ["INT"], ["LUK"], ["Ice/Lightning Arch Mage", "I/L Arch Mage"]),
            job("비숍", "Bishop", ["INT"], ["LUK"]),
        ],
        궁수: [
            job("보우마스터", "Bowmaster", ["DEX"], ["STR"]),
            job("신궁", "Marksman", ["DEX"], ["STR"]),
            job("패스파인더", "Pathfinder", ["DEX"], ["STR"], ["Path Finder"]),
        ],
        도적: [
            job("나이트로드", "Night Lord", ["LUK"], ["DEX"]),
            job("섀도어", "Shadower", ["LUK"], ["DEX"]),
            job("듀얼블레이드", "Dual Blade", ["LUK"], ["DEX"]),
        ],
        해적: [
            job("바이퍼", "Buccaneer", ["STR"], ["DEX"], ["Viper"]),
            job("캡틴", "Corsair", ["DEX"], ["STR"], ["Captain"]),
            job("캐논슈터", "Cannoneer", ["STR"], ["DEX"], ["Cannon Shooter"]),
        ],
        공용: [],
    },
    "시그너스 기사단": {
        전사: [
            job("소울마스터", "Dawn Warrior", ["STR"], ["DEX"], ["Soul Master"]),
            job("미하일", "Mihile", ["STR"], ["DEX"]),
        ],
        마법사: [job("플레임위자드", "Blaze Wizard", ["INT"], ["LUK"], ["Flame Wizard"])],
        궁수: [job("윈드브레이커", "Wind Archer", ["DEX"], ["STR"], ["Wind Breaker"])],
        도적: [job("나이트워커", "Night Walker", ["LUK"], ["DEX"])],
        해적: [job("스트라이커", "Thunder Breaker", ["STR"], ["DEX"], ["Striker"])],
        공용: [],
    },
    영웅: {
        전사: [job("아란", "Aran", ["STR"], ["DEX"])],
        마법사: [
            job("에반", "Evan", ["INT"], ["LUK"]),
            job("루미너스", "Luminous", ["INT"], ["LUK"]),
        ],
        궁수: [job("메르세데스", "Mercedes", ["DEX"], ["STR"])],
        도적: [job("팬텀", "Phantom", ["LUK"], ["DEX"])],
        해적: [job("은월", "Shade", ["LUK"], ["DEX"], ["Eunwol"])],
        공용: [],
    },
    레지스탕스: {
        전사: [job("블래스터", "Blaster", ["STR"], ["DEX"])],
        마법사: [job("배틀메이지", "Battle Mage", ["INT"], ["LUK"])],
        궁수: [],
        도적: [job("와일드헌터", "Wild Hunter", ["DEX"], ["STR"])],
        해적: [job("메카닉", "Mechanic", ["DEX"], ["STR"])],
        공용: [job("제논", "Xenon", ["STR", "DEX", "LUK"])],
    },
    노바: {
        전사: [job("카이저", "Kaiser", ["STR"], ["DEX"])],
        마법사: [],
        궁수: [job("카인", "Kain", ["DEX"], ["STR"])],
        도적: [job("카데나", "Cadena", ["LUK"], ["DEX"])],
        해적: [job("엔젤릭버스터", "Angelic Buster", ["DEX"], ["STR"], ["AngelicBuster"])],
        공용: [],
    },
    레프: {
        전사: [job("아델", "Adele", ["STR"], ["DEX"])],
        마법사: [job("일리움", "Illium", ["INT"], ["LUK"], ["Ilium"])],
        궁수: [],
        도적: [],
        해적: [job("아크", "Ark", ["STR"], ["DEX"])],
        공용: [],
    },
    아니마: {
        전사: [],
        마법사: [job("라라", "Lara", ["INT"], ["LUK"])],
        궁수: [],
        도적: [],
        해적: [job("호영", "Hoyoung", ["LUK"], ["DEX"], ["Ho Young", "HoYoung"])],
        공용: [],
    },
    기타: {
        전사: [],
        마법사: [],
        궁수: [],
        도적: [],
        해적: [],
        공용: [
            job("제로", "Zero", ["STR"], ["DEX"]),
            job("키네시스", "Kinesis", ["INT"], ["LUK"]),
        ],
    },
};

export const JOB_NAME_MAP: Record<string, JobInfo> = (() => {
    const map: Record<string, JobInfo> = {};

    const register = (key: string | undefined, info: JobInfo) => {
        if (!key) return;
        const normalized = key.trim().toLowerCase();
        if (!normalized || normalized in map) return;
        map[normalized] = info;
    };

    Object.values(JOBS).forEach((branches) => {
        Object.values(branches).forEach((jobs) => {
            jobs.forEach((info) => {
                register(info.name.ko, info);
                register(info.name.en, info);
                info.aliases?.forEach((alias) => register(alias, info));
            });
        });
    });

    return map;
})();

export const getJobInfoByName = (name?: string) => {
    if (!name) return undefined;
    return JOB_NAME_MAP[name.trim().toLowerCase()];
};
