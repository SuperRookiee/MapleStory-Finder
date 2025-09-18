export type JobStat = "STR" | "DEX" | "INT" | "LUK" | "HP" | "MP";

export type LocalizedText = {
    ko: string;
    en: string;
};

export interface JobInfo {
    name: LocalizedText;
    mainStat: JobStat[];
    subStat?: JobStat[];
    aliases?: string[];
}
