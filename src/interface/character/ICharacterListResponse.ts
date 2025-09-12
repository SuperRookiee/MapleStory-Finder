import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

export interface ICharacterListResponse {
    message: string;
    status: number;
    characters: ICharacterSummary[];
}