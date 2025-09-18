export interface JobInfo {
    name: string;
    mainStat: ('STR' | 'DEX' | 'INT' | 'LUK')[];
    subStat?: ('STR' | 'DEX' | 'INT' | 'LUK')[];
}