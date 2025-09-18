import { JobInfo } from "@/interface/job/IJobInfo";

export type JobRootCategory =
    | '모험가'
    | '시그너스 기사단'
    | '영웅'
    | '레지스탕스'
    | '노바'
    | '레프'
    | '아니마'
    | '기타';

export type JobBranch = '전사' | '마법사' | '궁수' | '도적' | '해적' | '공용';

export const JOBS: Record<JobRootCategory, Record<JobBranch, JobInfo[]>> = {
    '모험가': {
        '전사': [
            { name: '히어로', mainStat: ['STR'], subStat: ['DEX'] },
            { name: '팔라딘', mainStat: ['STR'], subStat: ['DEX'] },
            { name: '다크나이트', mainStat: ['STR'], subStat: ['DEX'] },
        ],
        '마법사': [
            { name: '아크메이지(불,독)', mainStat: ['INT'], subStat: ['LUK'] },
            { name: '아크메이지(썬,콜)', mainStat: ['INT'], subStat: ['LUK'] },
            { name: '비숍', mainStat: ['INT'], subStat: ['LUK'] },
        ],
        '궁수': [
            { name: '보우마스터', mainStat: ['DEX'], subStat: ['STR'] },
            { name: '신궁', mainStat: ['DEX'], subStat: ['STR'] },
            { name: '패스파인더', mainStat: ['DEX'], subStat: ['STR'] },
        ],
        '도적': [
            { name: '나이트로드', mainStat: ['LUK'], subStat: ['DEX'] },
            { name: '섀도어', mainStat: ['LUK'], subStat: ['DEX'] },
            { name: '듀얼블레이드', mainStat: ['LUK'], subStat: ['DEX'] },
        ],
        '해적': [
            { name: '바이퍼', mainStat: ['STR'], subStat: ['DEX'] },
            { name: '캡틴', mainStat: ['DEX'], subStat: ['STR'] },
            { name: '캐논슈터', mainStat: ['STR'], subStat: ['DEX'] },
        ],
        '공용': [],
    },
    '시그너스 기사단': {
        '전사': [
            { name: '소울마스터', mainStat: ['STR'], subStat: ['DEX'] },
            { name: '미하일', mainStat: ['STR'], subStat: ['DEX'] },
        ],
        '마법사': [{ name: '플레임위자드', mainStat: ['INT'], subStat: ['LUK'] }],
        '궁수': [{ name: '윈드브레이커', mainStat: ['DEX'], subStat: ['STR'] }],
        '도적': [{ name: '나이트워커', mainStat: ['LUK'], subStat: ['DEX'] }],
        '해적': [{ name: '스트라이커', mainStat: ['STR'], subStat: ['DEX'] }],
        '공용': [],
    },
    '영웅': {
        '전사': [{ name: '아란', mainStat: ['STR'], subStat: ['DEX'] }],
        '마법사': [
            { name: '에반', mainStat: ['INT'], subStat: ['LUK'] },
            { name: '루미너스', mainStat: ['INT'], subStat: ['LUK'] },
        ],
        '궁수': [{ name: '메르세데스', mainStat: ['DEX'], subStat: ['STR'] }],
        '도적': [{ name: '팬텀', mainStat: ['LUK'], subStat: ['DEX'] }],
        '해적': [{ name: '은월', mainStat: ['LUK'], subStat: ['DEX'] }],
        '공용': [],
    },
    '레지스탕스': {
        '전사': [{ name: '블래스터', mainStat: ['STR'], subStat: ['DEX'] }],
        '마법사': [{ name: '배틀메이지', mainStat: ['INT'], subStat: ['LUK'] }],
        '궁수': [],
        '도적': [{ name: '와일드헌터', mainStat: ['DEX'], subStat: ['STR'] }],
        '해적': [{ name: '메카닉', mainStat: ['DEX'], subStat: ['STR'] }],
        '공용': [{ name: '제논', mainStat: ['STR', 'DEX', 'LUK'] }],
    },
    '노바': {
        '전사': [{ name: '카이저', mainStat: ['STR'], subStat: ['DEX'] }],
        '마법사': [],
        '궁수': [{ name: '카인', mainStat: ['DEX'], subStat: ['STR'] }],
        '도적': [{ name: '카데나', mainStat: ['LUK'], subStat: ['DEX'] }],
        '해적': [{ name: '엔젤릭버스터', mainStat: ['DEX'], subStat: ['STR'] }],
        '공용': [],
    },
    '레프': {
        '전사': [{ name: '아델', mainStat: ['STR'], subStat: ['DEX'] }],
        '마법사': [{ name: '일리움', mainStat: ['INT'], subStat: ['LUK'] }],
        '궁수': [],
        '도적': [],
        '해적': [{ name: '아크', mainStat: ['STR'], subStat: ['DEX'] }],
        '공용': [],
    },
    '아니마': {
        '전사': [],
        '마법사': [{ name: '라라', mainStat: ['INT'], subStat: ['LUK'] }],
        '궁수': [],
        '도적': [],
        '해적': [{ name: '호영', mainStat: ['LUK'], subStat: ['DEX'] }],
        '공용': [],
    },
    '기타': {
        '전사': [],
        '마법사': [],
        '궁수': [],
        '도적': [],
        '해적': [],
        '공용': [
            { name: '제로', mainStat: ['STR'], subStat: ['DEX'] },
            { name: '키네시스', mainStat: ['INT'], subStat: ['LUK'] },
        ],
    },
};