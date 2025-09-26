"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TodoListMemo } from "@/fetchs/todoList.fetch";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { formatKstDateLabel } from "@/utils/date";
import { cn } from "@/utils/utils";

interface MemoPanelProps {
    memos: TodoListMemo[];
    onAdd: (text: string) => Promise<void> | void;
    onToggle: (memoId: string, completed: boolean) => Promise<void> | void;
    onRemove: (memoId: string) => Promise<void> | void;
    onUpdate: (memoId: string, payload: { text: string; dueDate?: string | null }) => Promise<void> | void;
}

const MemoPanel = ({ memos, onAdd, onToggle, onRemove, onUpdate }: MemoPanelProps) => {
    const t = useTranslations();
    const { language } = useLanguage();
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingMemo, setEditingMemo] = useState<TodoListMemo | null>(null);
    const [editText, setEditText] = useState("");
    const [editDate, setEditDate] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);

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

    const handleToggle = async (memo: TodoListMemo) => {
        await onToggle(memo.id, !memo.completed);
    };

    const handleRemove = async (memoId: string) => {
        await onRemove(memoId);
    };

    const handleOpenEdit = (memo: TodoListMemo) => {
        setEditingMemo(memo);
        setEditText(memo.text);
        setEditDate(memo.dueDate ?? "");
    };

    const handleCloseEdit = () => {
        setEditingMemo(null);
        setEditText("");
        setEditDate("");
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!editingMemo || !editText.trim()) {
            return;
        }
        setIsEditing(true);
        try {
            await onUpdate(editingMemo.id, {
                text: editText.trim(),
                dueDate: editDate ? editDate : null,
            });
            handleCloseEdit();
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t("todoList.memos.title")}
                        </CardTitle>
                        <CardDescription>{t("todoList.memos.description")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground">
                        {t("todoList.memos.weeklyReset")}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border bg-background/60 p-4 shadow-sm">
                    <label className="text-sm font-medium text-foreground" htmlFor="memo-input">
                        {t("todoList.memos.addLabel")}
                    </label>
                    <textarea
                        id="memo-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={t("todoList.memos.placeholder")}
                        className="min-h-[88px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <Button type="submit" disabled={isSubmitting || !input.trim()} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {isSubmitting ? t("todoList.memos.saving") : t("todoList.memos.addButton")}
                    </Button>
                </form>

                <div className="space-y-3">
                    {memos.length === 0 ? (
                        <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                            {t("todoList.memos.empty")}
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
                                                ? t("todoList.memos.completedLabel")
                                                : t("todoList.memos.todoLabel")}
                                        </p>
                                        <div className="mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                {memo.dueDate
                                                    ? t("todoList.memos.dueDateLabel", {
                                                          date: formatKstDateLabel(memo.dueDate, language),
                                                      })
                                                    : t("todoList.memos.noDueDate")}
                                            </Badge>
                                        </div>
                                    </div>
                                </button>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-1 h-8 w-8 rounded-full p-0 text-muted-foreground"
                                        onClick={() => handleOpenEdit(memo)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-1 h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleRemove(memo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
            <Dialog open={Boolean(editingMemo)} onOpenChange={(open) => { if (!open) handleCloseEdit(); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t("todoList.memos.edit.title")}</DialogTitle>
                        <DialogDescription>{t("todoList.memos.edit.description")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground" htmlFor="memo-edit-text">
                                {t("todoList.memos.edit.textLabel")}
                            </label>
                            <textarea
                                id="memo-edit-text"
                                value={editText}
                                onChange={(event) => setEditText(event.target.value)}
                                className="min-h-[96px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground" htmlFor="memo-edit-date">
                                {t("todoList.memos.edit.dateLabel")}
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="memo-edit-date"
                                    type="date"
                                    value={editDate}
                                    onChange={(event) => setEditDate(event.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-9"
                                    onClick={() => setEditDate("")}
                                    disabled={!editDate}
                                >
                                    {t("todoList.memos.edit.clearDate")}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                {t("common.cancel")}
                            </Button>
                        </DialogClose>
                        <Button onClick={handleSaveEdit} disabled={isEditing || !editText.trim()}>
                            {isEditing
                                ? t("todoList.memos.edit.saving")
                                : t("todoList.memos.edit.save")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default MemoPanel;
