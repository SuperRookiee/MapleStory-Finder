export interface IGuildResponse<T> {
    message: string;
    status: number;
    data: T;
}
