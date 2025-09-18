import { ICharacterSummary } from "@/interface/character/ICharacterSummary";

export interface IUserAccountCharacterList {
    account_id: string;
    character_list: ICharacterSummary[];
}

export interface IUserCharacterList {
    account_list: IUserAccountCharacterList[];
    characters: ICharacterSummary[];
}
