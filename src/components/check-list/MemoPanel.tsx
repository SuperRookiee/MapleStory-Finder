"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistMemo } from "@/fetchs/checkList.fetch";
import { useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface MemoPanelProps {
    memos: ChecklistMemo[];
    onAdd: (text: string) => Promise<void> | void;
    onToggle: (memoId: string, completed: boolean) => Promise<void> | void;
    onRemove: (memoId: string) => Promise<void> | void;
}

const MemoPanel = ({ memos, onAdd, onToggle, onRemove }: MemoPanelProps) => {
    const t = useTranslations();
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!input.trim()) return;
        setIsSubmitting(true);
        try {
            await onAdd(input.trim());
            setInput("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle = async (memo: ChecklistMemo) => {
        await onToggle(memo.id, !memo.completed);
    };

    const handleRemove = async (memoId: string) => {
        await onRemove(memoId);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t("checkList.memos.title")}
                        </CardTitle>
                        <CardDescription>{t("checkList.memos.description")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground">
                        {t("checkList.memos.weeklyReset")}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border bg-background/60 p-4 shadow-sm">
                    <label className="text-sm font-medium text-foreground" htmlFor="memo-input">
                        {t("checkList.memos.addLabel")}
                    </label>
                    <textarea
                        id="memo-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={t("checkList.memos.placeholder")}
                        className="min-h-[88px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <Button type="submit" disabled={isSubmitting || !input.trim()} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {isSubmitting ? t("checkList.memos.saving") : t("checkList.memos.addButton")}
                    </Button>
                </form>

                <div className="space-y-3">
                    {memos.length === 0 ? (
                        <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                            {t("checkList.memos.empty")}
                        </div>
                    ) : (
                        memos.map((memo) => (
                            <div
                                key={memo.id}
                                className={cn(
                                    "flex items-start justify-between gap-3 rounded-xl border bg-background/70 p-4 shadow-sm transition",
                                    memo.completed ? "border-primary/50 bg-primary/10" : "hover:border-primary/40",
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleToggle(memo)}
                                    className="flex flex-1 items-start gap-3 text-left"
                                >
                                    <span className="mt-0.5 text-primary">
                                        {memo.completed ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </span>
                                    <div>
                                        <p className={cn("text-sm font-medium", memo.completed && "line-through opacity-70")}>
                                            {memo.text}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {memo.completed
                                                ? t("checkList.memos.completedLabel")
                                                : t("checkList.memos.todoLabel")}
                                        </p>
                                    </div>
                                </button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemove(memo.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MemoPanel;
