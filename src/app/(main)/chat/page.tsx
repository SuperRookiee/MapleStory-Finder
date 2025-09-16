"use client";

import {
    FormEvent,
    unstable_ViewTransition as ViewTransition,
    useEffect,
    useRef,
    useState,
} from "react";
import { Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { buildPromptContext } from "@/libs/promptContext";
import type { ChatHistoryMessage } from "@/types/ai/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { requestAiChat } from "@/fetchs/ai/chat.fetch";
import { chatStore } from "@/stores/chatStore";
import { cn } from "@/utils/utils";

const ChatPage = () => {
    const [question, setQuestion] = useState("");
    const [pendingContext, setPendingContext] = useState<string | null>(null);
    const messages = chatStore((state) => state.messages);
    const isLoading = chatStore((state) => state.isLoading);
    const addMessage = chatStore((state) => state.addMessage);
    const setLoading = chatStore((state) => state.setLoading);
    const clear = chatStore((state) => state.clear);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLoading) return;

        const trimmed = question.trim();
        if (!trimmed) return;

        setQuestion("");
        const historySnapshot: ChatHistoryMessage[] = chatStore
            .getState()
            .messages.map(({ role, content }) => ({ role, content }));
        const contextPromise = buildPromptContext(trimmed);
        setPendingContext(null);
        setLoading(true);

        addMessage({ role: "user", content: trimmed });

        try {
            const context = await contextPromise;
            setPendingContext(context);

            const { reply } = await requestAiChat({
                message: trimmed,
                history: historySnapshot,
                context,
            });

            addMessage({ role: "assistant", content: reply });
        } catch (error) {
            const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
            addMessage({ role: "assistant", content: `요청 처리 중 오류가 발생했습니다. ${message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ViewTransition enter="fade" exit="fade">
            <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
                <Card className="flex h-full flex-col">
                    <CardHeader className="border-b px-4 py-5 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="space-y-2">
                                <CardTitle className="text-xl font-bold sm:text-2xl">Gemini AI 챗봇</CardTitle>
                                <CardDescription className="space-y-1 text-sm text-muted-foreground">
                                    <p>메이플스토리 캐릭터, 길드, 장비 데이터를 활용해 질문에 답변합니다.</p>
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full gap-2 sm:w-auto"
                                onClick={() => {
                                    clear();
                                    setPendingContext(null);
                                    setQuestion("");
                                }}
                                disabled={!messages.length || isLoading}
                            >
                                <Trash2 className="h-4 w-4"/> 초기화
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 sm:px-6">
                        <ScrollArea className="h-full pr-1 sm:pr-2">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {messages.length === 0 && !isLoading ? (
                                    <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground sm:p-6">
                                        첫 질문을 입력하면 Gemini AI가 관련 데이터를 수집해 답변을 제공합니다.
                                    </div>
                                ) : null}
                                {messages.map((message) => {
                                    const isUser = message.role === "user";
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex w-full gap-2 sm:gap-3",
                                                isUser ? "justify-end" : "justify-start",
                                            )}
                                        >
                                            {!isUser && (
                                                <div
                                                    className={cn(
                                                        "flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground sm:h-10 sm:w-10"
                                                    )}
                                                >
                                                    <Bot className="h-4 w-4"/>
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap sm:max-w-[75%]",
                                                    isUser
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-muted-foreground",
                                                )}
                                            >
                                                {message.content}
                                            </div>
                                            {isUser && (
                                                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-9 sm:w-9">
                                                    <User className="h-4 w-4"/>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        <span>Gemini AI가 정보를 분석하고 있습니다...</span>
                                    </div>
                                ) : null}
                                <div ref={bottomRef}/>
                            </div>
                        </ScrollArea>
                        {pendingContext ? (
                            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground sm:text-sm">
                                <p className="font-medium text-foreground">참고 데이터 요약</p>
                                <pre className="mt-1 max-h-40 whitespace-pre-wrap overflow-y-auto font-sans text-xs leading-relaxed text-muted-foreground sm:max-h-48">
                                    {pendingContext}
                                </pre>
                            </div>
                        ) : null}
                    </CardContent>
                    <CardFooter className="border-t px-4 py-4 sm:px-6">
                        <form className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3" onSubmit={handleSubmit}>
                            <Input
                                placeholder="질문을 입력하세요"
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                                autoFocus
                                className="h-12 text-base sm:h-10"
                            />
                            <Button
                                type="submit"
                                className="h-12 w-full gap-2 sm:h-10 sm:w-auto"
                                disabled={isLoading || question.trim().length === 0}
                            >
                                <Send className="h-4 w-4"/>
                                <span className="sr-only sm:not-sr-only sm:inline">보내기</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </ViewTransition>
    );
};

export default ChatPage;
