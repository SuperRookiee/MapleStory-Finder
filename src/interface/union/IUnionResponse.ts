export interface IUnionResponse<T> {
    message: string;
    status: number;
    data: T;
}
