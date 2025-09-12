export interface CharacterResponse<T> {
    message: string;
    status: number;
    data: T;
}
