export interface IUserResponse<T> {
    message: string;
    status: number;
    data: T;
}
