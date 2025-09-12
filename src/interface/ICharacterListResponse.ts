import { ICharacterSummary } from "@/interface/ICharacterSummary";

export interface ICharacterListResponse {
    message: string;
    status: number;
    characters: ICharacterSummary[];
}