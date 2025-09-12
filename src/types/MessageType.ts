export type SuccessType = {
    message: string;
    status?: number;
};

export type ErrorType = {
    error: {
        message: string
    };
    status?: number;
};

export type WithoutConflict<T> = Omit<T, keyof SuccessType | keyof ErrorType>;
