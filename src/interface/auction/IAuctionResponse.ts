export interface IAuctionResponse<T> {
    message: string;
    status: number;
    data: T;
}
