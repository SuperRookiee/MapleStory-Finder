import { NextResponse } from "next/server";

type Handler<T> = (body: T) => Promise<unknown>;
type ParamHandler<T> = (params: T) => Promise<unknown>;

interface IErrorResponse {
    options: ErrorOptions | undefined;
    error: {
        message: string;
    };
}

class CustomError extends Error {
    data: unknown;

    constructor(message: string, data: unknown) {
        super(message);
        this.name = "CustomError";
        this.data = data;
    }
}

const isErrorResponse = (result: unknown): result is IErrorResponse => {
    return (
        typeof result === "object" &&
        result !== null &&
        "error" in result &&
        typeof (result as Record<string, unknown>).error === "object" &&
        typeof (result as IErrorResponse).error.message === "string"
    );
};

export const Get =
    <T>(handler: Handler<T>) =>
        async (req: Request): Promise<Response> => {
            try {
                const url = new URL(req.url);
                const query = Object.fromEntries(url.searchParams.entries()) as unknown as T;
                const result = await handler(query);
                if (isErrorResponse(result)) throw new Error(result.error.message); // result에 error가 있으면 Error
                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ error: { message: (error as Error).message } }, { status: 400 });
            }
        };

export const GetWithParams =
    <T extends Record<string, string>>(handler: ParamHandler<T>) =>
        async (req: Request, context: { params: Record<string, string> }): Promise<Response> => {
            try {
                const url = new URL(req.url);
                const queryParams = Object.fromEntries(url.searchParams.entries());
                const dynamicParams = await context.params; // params 추출

                const result = await handler({ ...queryParams, ...dynamicParams } as T);
                if (isErrorResponse(result)) throw new Error(result.error.message);

                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json(
                    { error: { message: (error as Error).message } },
                    { status: 400 }
                );
            }
        };

export const Post =
    <T>(handler: Handler<T>) =>
        async (req: Request): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const result = await handler(body);
                if (isErrorResponse(result)) {
                    const { error, options } = result as IErrorResponse;
                    throw new CustomError(error.message, options);
                }
                return NextResponse.json(result);
            } catch (error) {
                if (error instanceof CustomError) {
                    return NextResponse.json(
                        {
                            error: { message: error.message },
                            options: error.data as object, // 여기서 options 안의 내용 포함시킴
                        },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ error: { message: (error as Error).message } }, { status: 400 });
            }
        };

export const Patch =
    <T>(handler: Handler<T>) =>
        async (req: Request): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const result = await handler(body);

                if (isErrorResponse(result)) throw new Error(result.error.message);

                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ error: { message: (error as Error).message } }, { status: 400 });
            }
        };

export const PatchWithParams =
    <T, P>(handler: (params: P, body: T) => Promise<unknown>) =>
        async (req: Request, context: { params: P }): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const result = await handler(context.params, body);

                if (isErrorResponse(result)) throw new Error(result.error.message);

                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ error: { message: (error as Error).message } }, { status: 400 });
            }
        };

export const Delete =
    <T>(handler: Handler<T>) =>
        async (req: Request): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const result = await handler(body);

                if (isErrorResponse(result)) throw new Error(result.error.message);

                return NextResponse.json(result);
            } catch (error) {
                return NextResponse.json({ error: { message: (error as Error).message } }, { status: 400 });
            }
        };

/**
 * FormData를 일반 객체로 변환하는 범용 유틸 함수
 * - key에 값이 1개면 단일값
 * - key에 값이 여러 개면 배열로 변환
 *
 * @param formData FormData 객체
 * @returns 객체 형태의 데이터 (Record<string, FormDataEntryValue | FormDataEntryValue[]>)
 */
export const convertFormData = (formData: FormData): Record<string, FormDataEntryValue | FormDataEntryValue[]> => {
    const result: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
    const keys = Array.from(formData.keys());

    const uniqueKeys = [...new Set(keys)];

    for (const key of uniqueKeys) {
        const values = formData.getAll(key);
        result[key] = values.length === 1 ? values[0] : values;
    }

    return result;
};

/**
 * FormData를 객체 배열로 변환하는 유틸 함수
 * - 각 key에 대해 getAll()로 배열 수집
 * - 인덱스를 기준으로 동일 위치 데이터를 묶어 객체 배열 생성
 */
export const convertFormDataToObjectList = <T>(formData: FormData, keys: (keyof T)[]): T[] => {
    const result: T[] = [];

    const valueMap: Record<string, FormDataEntryValue[]> = {};
    keys.forEach((key) => {
        valueMap[key as string] = formData.getAll(key as string);
    });

    const length = Math.max(...Object.values(valueMap).map((values) => values.length));

    for (let i = 0; i < length; i++) {
        const item: Partial<T> = {};
        keys.forEach((key) => {
            item[key] = valueMap[key as string]?.[i] as T[typeof key];
        });
        result.push(item as T);
    }

    return result;
};
