export interface ICharacterResponse<T> {
    message: string;
    status: number;
    data: T;
}
