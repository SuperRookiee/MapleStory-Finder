import { Post } from "@/utils/fetch";
import { Failed, Success } from "@/utils/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ChatHistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

type ChatRequestBody = {
    message: string;
    history?: ChatHistoryMessage[];
    context?: string | null;
};

const buildEndpoint = () => {
    const base = process.env.OPENAI_API_BASE_URL ?? "https://api.openai.com/v1";
    return `${base.replace(/\/$/, "")}/chat/completions`;
};

export const POST = Post<ChatRequestBody>(async ({ message, history = [], context }) => {
    if (!message || message.trim().length === 0) {
        return Failed("질문을 입력해주세요.", 400);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return Failed("OpenAI API Key가 설정되어 있지 않습니다.", 500);
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const sanitizedHistory = history
        .filter((entry): entry is ChatHistoryMessage =>
            Boolean(entry && typeof entry.content === "string" && (entry.role === "user" || entry.role === "assistant"))
        )
        .slice(-10)
        .map((entry) => ({ role: entry.role, content: entry.content }));

    const contextBlock = context?.trim()
        ? `다음은 사용자의 질문과 관련된 메이플스토리 데이터입니다. 이 정보를 우선적으로 참고하세요.\n\n${context.trim()}`
        : null;

    const messages = [
        {
            role: "system" as const,
            content:
                "당신은 MapleStory Finder의 AI 어시스턴트입니다. 최신 메이플스토리 데이터를 기반으로 정중하게 한국어로 답변하고, 제공된 정보가 불완전할 경우 그 사실을 명확히 밝히세요.",
        },
        ...sanitizedHistory,
        {
            role: "user" as const,
            content: contextBlock ? `${contextBlock}\n\n질문: ${message}` : message,
        },
    ];

    const endpoint = buildEndpoint();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    const organization = process.env.OPENAI_ORG_ID ?? process.env.OPENAI_ORGANIZATION;
    if (organization) {
        headers["OpenAI-Organization"] = organization;
    }

    const project = process.env.OPENAI_PROJECT_ID ?? process.env.OPENAI_PROJECT;
    if (project) {
        headers["OpenAI-Project"] = project;
    }

    const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
            model,
            temperature: 0.2,
            messages,
        }),
    });

    if (!response.ok) {
        let errorMessage = "OpenAI API 요청에 실패했습니다.";
        try {
            const errorBody = await response.json();
            errorMessage =
                errorBody?.error?.message ||
                errorBody?.message ||
                `${errorMessage} (status: ${response.status})`;
        } catch (error) {
            if (error instanceof Error) {
                errorMessage = `${errorMessage} (${error.message})`;
            }
        }
        return Failed(errorMessage, response.status);
    }

    const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
    };

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
        return Failed("OpenAI 응답이 비어 있습니다.", 500);
    }

    return Success("AI 응답 생성 성공", 200, { reply });
});
