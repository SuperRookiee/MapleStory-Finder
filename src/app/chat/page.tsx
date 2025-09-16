"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainLayout from "@/app/layout/MainLayout";
import { findCharacterBasic, findCharacterId, findCharacterItemEquipment, findCharacterStat } from "@/fetchs/character.fetch";
import { findGuildBasic, findGuildId } from "@/fetchs/guild.fetch";
import { findUnion } from "@/fetchs/union.fetch";
import type { ICharacterItemEquipment, ICharacterStat } from "@/interface/character/ICharacter";
import { chatStore } from "@/stores/chatStore";
import { cn } from "@/utils/utils";

const cleanValue = (value: string) =>
    value
        .replace(/["'“”‘’]/g, "")
        .replace(/^[-\s]+/, "")
        .trim()
        .replace(/[\s,.;!?]+$/, "")
        .trim();

const extractValues = (text: string, keywords: string[]) => {
    const pattern = new RegExp(`(?:${keywords.join("|")})\\s*(?:[:：=~-])\\s*["“”'‘’]?([^\n,.;!?]+)`, "gi");
    const values = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
        const raw = match[1];
        if (!raw) continue;
        const cleaned = cleanValue(raw);
        if (cleaned.length) {
            values.add(cleaned);
        }
    }
    return Array.from(values);
};

const extractCharacterNames = (text: string) => {
    const names = extractValues(text, ["캐릭터", "character"]);
    return names.map((name) => {
        const [pureName] = name.split("(");
        return pureName.trim();
    });
};

const extractWorldHints = (text: string) => extractValues(text, ["월드", "world"]);

const extractGuildQueries = (text: string, worldHints: string[]) => {
    const candidates = extractValues(text, ["길드", "guild"]);
    const result: { name: string; world?: string }[] = [];
    candidates.forEach((candidate) => {
        const parenMatch = candidate.match(/(.+?)\s*\(([^)]+)\)/);
        if (parenMatch) {
            result.push({ name: cleanValue(parenMatch[1]), world: cleanValue(parenMatch[2]) });
            return;
        }
        result.push({ name: candidate, world: worldHints[0] });
    });

    const unique = new Map<string, { name: string; world?: string }>();
    result.forEach((item) => {
        const key = `${item.name.toLocaleLowerCase()}|${(item.world ?? "").toLocaleLowerCase()}`;
        if (!unique.has(key)) {
            unique.set(key, item);
        }
    });
    return Array.from(unique.values());
};

const formatStatSummary = (stat?: ICharacterStat | null) => {
    if (!stat) return null;
    const keywords = [
        "STR",
        "DEX",
        "INT",
        "LUK",
        "최대 HP",
        "최대 MP",
        "공격력",
        "마력",
        "보스 몬스터공격 시 데미지",
        "크리티컬 데미지",
        "방어율 무시",
        "데미지",
    ];
    const candidates = stat.final_stat
        .filter((entry) => keywords.some((keyword) => entry.stat_name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())))
        .slice(0, 6)
        .map((entry) => `${entry.stat_name}: ${entry.stat_value}`);
    if (!candidates.length) return null;
    return candidates.join(", ");
};

const formatItemSummary = (itemEquip?: ICharacterItemEquipment | null) => {
    if (!itemEquip?.item_equipment?.length) return null;
    const highlights = itemEquip.item_equipment.slice(0, 5).map((item) => {
        const gradeParts = [
            item.starforce ? `${item.starforce}성` : null,
            item.potential_option_grade ? `잠재 ${item.potential_option_grade}` : null,
            item.additional_potential_option_grade ? `에디셔널 ${item.additional_potential_option_grade}` : null,
        ].filter(Boolean);
        const potentials = [item.potential_option_1, item.potential_option_2, item.potential_option_3]
            .filter((opt): opt is string => Boolean(opt))
            .slice(0, 2)
            .join(" / ");
        const details = gradeParts.length ? ` (${gradeParts.join(", ")})` : "";
        const potentialText = potentials ? ` - 주요 잠재: ${potentials}` : "";
        return `  • ${item.item_equipment_part}: ${item.item_name}${details}${potentialText}`;
    });
    return highlights.join("\n");
};

const buildCharacterSummary = async (
    name: string,
    options: { includeStats: boolean; includeItems: boolean; includeUnion: boolean }
) => {
    try {
        const idRes = await findCharacterId(name);
        const ocid = idRes.data.ocid;
        const [basicRes, statRes, unionRes, itemRes] = await Promise.all([
            findCharacterBasic(ocid),
            options.includeStats ? findCharacterStat(ocid) : Promise.resolve(null),
            options.includeUnion ? findUnion(ocid) : Promise.resolve(null),
            options.includeItems ? findCharacterItemEquipment(ocid) : Promise.resolve(null),
        ]);

        const basic = basicRes.data;
        const stat = statRes?.data ?? null;
        const union = unionRes?.data ?? null;
        const items = itemRes?.data ?? null;

        let summary = `캐릭터 "${basic.character_name}" (${basic.world_name})`;
        summary += `\n- 직업: ${basic.character_class} / 레벨: ${basic.character_level}`;
        summary += `\n- 길드: ${basic.character_guild_name || "없음"}`;

        const statSummary = formatStatSummary(stat);
        if (statSummary) {
            summary += `\n- 주요 스탯: ${statSummary}`;
        }

        if (union) {
            summary += `\n- 유니온: 레벨 ${union.union_level} (${union.union_grade}), 아티팩트 레벨 ${union.union_artifact_level}`;
        }

        const itemSummary = formatItemSummary(items);
        if (itemSummary) {
            summary += `\n- 장비 하이라이트:\n${itemSummary}`;
        }

        return summary;
    } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        return `캐릭터 "${name}" 정보를 불러오지 못했습니다: ${message}`;
    }
};

const buildGuildSummary = async ({ name, world }: { name: string; world?: string }) => {
    if (!world) {
        return `길드 "${name}" 정보를 불러오려면 월드 정보가 필요합니다. 질문에 "월드: 스카니아"와 같이 입력해주세요.`;
    }

    try {
        const idRes = await findGuildId(name, world);
        const oguildId = idRes.data.oguild_id;
        const basicRes = await findGuildBasic(oguildId);
        const basic = basicRes.data;

        let summary = `길드 "${basic.guild_name}" (${basic.world_name})`;
        summary += `\n- 길드 레벨: ${basic.guild_level}, 명성: ${basic.guild_fame}, 포인트: ${basic.guild_point}`;
        summary += `\n- 길드 마스터: ${basic.guild_master_name}, 멤버 수: ${basic.guild_member_count}`;

        if (basic.guild_skill?.length) {
            const skills = basic.guild_skill.slice(0, 3).map((skill) => `${skill.skill_name}(Lv.${skill.skill_level})`);
            summary += `\n- 주요 길드 스킬: ${skills.join(", ")}`;
        }

        return summary;
    } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        return `길드 "${name}" (${world}) 정보를 불러오지 못했습니다: ${message}`;
    }
};

const buildPromptContext = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return null;

    const includeItems = /아이템|장비|item|equipment|템/i.test(trimmed);
    const includeStats = /스탯|스텟|stat|능력치/i.test(trimmed);
    const includeUnion = /유니온|union/i.test(trimmed);

    const worldHints = extractWorldHints(trimmed);
    const characterNames = extractCharacterNames(trimmed);
    const guildQueries = extractGuildQueries(trimmed, worldHints);

    const segments: string[] = [];

    if (characterNames.length) {
        const summaries = await Promise.all(
            characterNames.map((name) => buildCharacterSummary(name, { includeItems, includeStats, includeUnion }))
        );
        segments.push(...summaries.filter((summary): summary is string => Boolean(summary)));
    }

    if (guildQueries.length) {
        const summaries = await Promise.all(guildQueries.map((query) => buildGuildSummary(query)));
        segments.push(...summaries.filter((summary): summary is string => Boolean(summary)));
    }

    return segments.length ? segments.join("\n\n") : null;
};

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
        const historySnapshot = chatStore.getState().messages.map(({ role, content }) => ({ role, content }));
        const contextPromise = buildPromptContext(trimmed);
        setPendingContext(null);
        setLoading(true);

        addMessage({ role: "user", content: trimmed });

        try {
            const context = await contextPromise;
            setPendingContext(context);
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    history: historySnapshot,
                    context,
                }),
            });

            const data = await response.json();
            if (!response.ok || data?.error) {
                const errorMessage = data?.error?.message ?? "AI 응답 생성에 실패했습니다.";
                throw new Error(errorMessage);
            }

            const reply: string | undefined = data?.reply;
            if (!reply) {
                throw new Error("AI 응답이 비어 있습니다.");
            }

            addMessage({ role: "assistant", content: reply });
        } catch (error) {
            const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
            addMessage({ role: "assistant", content: `요청 처리 중 오류가 발생했습니다. ${message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="mx-auto flex h-full max-w-4xl flex-col">
                <Card className="flex h-full flex-col">
                    <CardHeader className="border-b">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold">Finder AI 챗봇</CardTitle>
                                <CardDescription className="mt-2 space-y-1 text-sm text-muted-foreground">
                                    <p>메이플스토리 캐릭터, 길드, 장비 데이터를 활용해 질문에 답변합니다.</p>
                                    <p>
                                        예시: <code>캐릭터: 메이플러</code>, <code>길드: 루미너스 (스카니아)</code>,
                                        <code>아이템</code> 키워드를 포함하면 장비 정보를 함께 분석합니다.
                                    </p>
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="gap-2"
                                onClick={() => {
                                    clear();
                                    setPendingContext(null);
                                    setQuestion("");
                                }}
                                disabled={!messages.length || isLoading}
                            >
                                <Trash2 className="h-4 w-4" /> 초기화
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-4 py-4">
                        <ScrollArea className="h-full pr-2">
                            <div className="flex flex-col gap-4">
                                {messages.length === 0 && !isLoading ? (
                                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                        첫 질문을 입력하면 Finder AI가 관련 데이터를 수집해 답변을 제공합니다.
                                    </div>
                                ) : null}
                                {messages.map((message) => {
                                    const isUser = message.role === "user";
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex w-full gap-3",
                                                isUser ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            {!isUser && (
                                                <div className="mt-1 rounded-full bg-muted p-2 text-muted-foreground">
                                                    <Bot className="h-4 w-4" />
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                                                    isUser
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {message.content}
                                            </div>
                                            {isUser && (
                                                <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Finder AI가 정보를 분석하고 있습니다...</span>
                                    </div>
                                ) : null}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>
                        {pendingContext ? (
                            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                                <p className="font-medium text-foreground">참고 데이터 요약</p>
                                <pre className="mt-1 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">
                                    {pendingContext}
                                </pre>
                            </div>
                        ) : null}
                    </CardContent>
                    <CardFooter className="border-t">
                        <form className="flex w-full items-center gap-3" onSubmit={handleSubmit}>
                            <Input
                                placeholder="질문을 입력하세요 (예: 캐릭터: 메이플러 장비를 분석해줘)"
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                                autoFocus
                            />
                            <Button type="submit" className="gap-2" disabled={isLoading || question.trim().length === 0}>
                                <Send className="h-4 w-4" /> 전송
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ChatPage;
