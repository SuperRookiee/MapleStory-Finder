import { NextResponse } from "next/server";

type Handler<T> = (body: T) => Promise<unknown>;
type ParamHandler<T> = (params: T) => Promise<unknown>;

interface IErrorResponse {
    error: {
        message: string;
    };
    status?: number;
    options?: ErrorOptions;
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
                if (isErrorResponse(result)) {
                    return NextResponse.json(result, {
                        status: result.status ?? 400,
                    });
                }
                return NextResponse.json(result, {
                    status: (result as { status?: number }).status ?? 200,
                });
            } catch (error) {
                return NextResponse.json(
                    { error: { message: (error as Error).message } },
                    { status: 400 }
                );
            }
        };

export const GetWithParams =
    <T extends Record<string, string>>(handler: ParamHandler<T>) =>
        async (
            req: Request,
            context: { params: Promise<Record<string, string>> }
        ): Promise<Response> => {
            try {
                const url = new URL(req.url);
                const queryParams = Object.fromEntries(url.searchParams.entries());
                const dynamicParams = await context.params; // params 추출

                const result = await handler({
                    ...queryParams,
                    ...dynamicParams,
                } as T);

                if (isErrorResponse(result)) {
                    return NextResponse.json(result, {
                        status: result.status ?? 400,
                    });
                }

                return NextResponse.json(result, {
                    status: (result as { status?: number }).status ?? 200,
                });
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
                    const { error, options, status } = result as IErrorResponse;
                    throw new CustomError(error.message, { ...(options ?? {}), status });
                }
                return NextResponse.json(result, {
                    status: (result as { status?: number }).status ?? 200,
                });
            } catch (error) {
                if (error instanceof CustomError) {
                    const { status, ...options } =
                        (error.data as { status?: number } & Record<string, unknown>) || {};
                    return NextResponse.json(
                        {
                            error: { message: error.message },
                            ...(Object.keys(options).length ? { options } : {}),
                        },
                        { status: typeof status === "number" ? status : 400 }
                    );
                }

                return NextResponse.json(
                    { error: { message: (error as Error).message } },
                    { status: 400 }
                );
            }
        };

export const Patch =
    <T>(handler: Handler<T>) =>
        async (req: Request): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const result = await handler(body);

                if (isErrorResponse(result)) {
                    return NextResponse.json(result, {
                        status: result.status ?? 400,
                    });
                }

                return NextResponse.json(result, {
                    status: (result as { status?: number }).status ?? 200,
                });
            } catch (error) {
                return NextResponse.json(
                    { error: { message: (error as Error).message } },
                    { status: 400 }
                );
            }
        };

export const PatchWithParams =
    <T, P>(handler: (params: P, body: T) => Promise<unknown>) =>
        async (
            req: Request,
            context: { params: Promise<P> }
        ): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const params = await context.params;
                const result = await handler(params, body);

                if (isErrorResponse(result)) {
                    return NextResponse.json(result, {
                        status: result.status ?? 400,
                    });
                }

                return NextResponse.json(result, {
                    status: (result as { status?: number }).status ?? 200,
                });
            } catch (error) {
                return NextResponse.json(
                    { error: { message: (error as Error).message } },
                    { status: 400 }
                );
            }
        };

export const Delete =
    <T>(handler: Handler<T>) =>
        async (req: Request): Promise<Response> => {
            try {
                const body = (await req.json()) as T;
                const result = await handler(body);

                if (isErrorResponse(result)) {
                    return NextResponse.json(result, {
                        status: result.status ?? 400,
                    });
                }

                return NextResponse.json(result, {
                    status: (result as { status?: number }).status ?? 200,
                });
            } catch (error) {
                return NextResponse.json(
                    { error: { message: (error as Error).message } },
                    { status: 400 }
                );
            }
        };
