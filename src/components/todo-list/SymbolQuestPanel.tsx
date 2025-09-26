"use client";

import { useMemo } from "react";
import { Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TODO_SYMBOL_QUESTS, TODO_SYMBOL_REGION_ORDER, TodoSymbolQuest } from "@/constants/todoSymbol";
import { SymbolQuestState } from "@/fetchs/todoList.fetch";
import { useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface SymbolQuestPanelProps {
    state: SymbolQuestState;
    loading?: boolean;
    onToggle: (questId: string, next: boolean) => void;
}

const SymbolQuestPanel = ({ state, loading = false, onToggle }: SymbolQuestPanelProps) => {
    const t = useTranslations();

    const regionGroups = useMemo(() => {
        return TODO_SYMBOL_REGION_ORDER.map((region) => {
            const quests = TODO_SYMBOL_QUESTS.filter((quest) => quest.region === region);
            const completed = quests.reduce((acc, quest) => {
                const done = Boolean(state.quests?.[quest.id]?.completedAt);
                return acc + (done ? 1 : 0);
            }, 0);
            return {
                region,
                quests,
                completed,
                total: quests.length,
            };
        });
    }, [state.quests]);

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index} className="h-full">
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="mt-2 h-4 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 3 }).map((__, skeletonIndex) => (
                                <Skeleton key={skeletonIndex} className="h-16 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const renderQuest = (quest: TodoSymbolQuest) => {
        const completed = Boolean(state.quests?.[quest.id]?.completedAt);

        return (
            <div
                key={quest.id}
                className={cn(
                    "group flex items-center justify-between gap-4 rounded-3xl border p-4 transition",
                    completed
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/80 bg-background hover:border-primary/40",
                )}
            >
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{quest.name}</p>
                        <Badge variant={completed ? "default" : "secondary"} className="text-xs">
                            {t(`todoList.symbol.frequency.${quest.frequency}`)}
                        </Badge>
                        {quest.reward ? (
                            <Badge variant="outline" className="text-xs">
                                {t("todoList.symbol.reward", { value: quest.reward })}
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t("todoList.symbol.area", { area: quest.area })}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onToggle(quest.id, !completed)}
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition",
                        completed
                            ? "border-primary bg-primary text-primary-foreground shadow"
                            : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                    )}
                    aria-pressed={completed}
                    aria-label={
                        completed
                            ? t("todoList.symbol.actions.markIncomplete", { quest: quest.name })
                            : t("todoList.symbol.actions.markComplete", { quest: quest.name })
                    }
                >
                    {completed ? <Check className="h-4 w-4" /> : t("todoList.symbol.status.todo")}
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardHeader className="gap-2">
                    <Badge variant="secondary" className="w-fit bg-primary/15 text-primary">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        {t("todoList.symbol.badge")}
                    </Badge>
                    <CardTitle className="text-2xl">{t("todoList.symbol.title")}</CardTitle>
                    <CardDescription>{t("todoList.symbol.description")}</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
                {regionGroups.map((group) => (
                    <Card key={group.region} className="flex h-full flex-col">
                        <CardHeader className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <CardTitle>{t(`todoList.symbol.regions.${group.region}.title`)}</CardTitle>
                                    <CardDescription>
                                        {t(`todoList.symbol.regions.${group.region}.description`)}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {t("todoList.symbol.summary", { count: group.completed, total: group.total })}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-3">
                            {group.quests.map((quest) => renderQuest(quest))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SymbolQuestPanel;
