"use client";

import { useMemo, useState } from "react";
import { CalendarRange, ChevronLeft, ChevronRight, Pencil, Plus, Users } from "lucide-react";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TodoListEvent } from "@/fetchs/todoList.fetch";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { formatKstDateLabel, formatKstMonthLabel, buildCalendarMatrix } from "@/utils/date";
import { cn } from "@/utils/utils";

const dayNames: Record<string, string[]> = {
    ko: ["일", "월", "화", "수", "목", "금", "토"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

const parseFriends = (raw: string) =>
    raw
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

type CalendarPanelProps = {
    monthKey: string;
    events: TodoListEvent[];
    selectedDateKey: string;
    onMonthChange: (amount: number) => void;
    onSelectDate: (dateKey: string) => void;
    onCreateEvent: (event: { title: string; friends: string[]; memo?: string }) => Promise<void> | void;
    onRemoveEvent: (eventId: string) => Promise<void> | void;
    onUpdateEvent: (
        eventId: string,
        payload: { title: string; friends: string[]; memo?: string; dateKey: string },
    ) => Promise<void> | void;
};

const CalendarPanel = ({
    monthKey,
    events,
    selectedDateKey,
    onMonthChange,
    onSelectDate,
    onCreateEvent,
    onRemoveEvent,
    onUpdateEvent,
}: CalendarPanelProps) => {
    const t = useTranslations();
    const { language } = useLanguage();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [friends, setFriends] = useState("");
    const [memo, setMemo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editFriends, setEditFriends] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [editDate, setEditDate] = useState(selectedDateKey);
    const [isEditing, setIsEditing] = useState(false);

    const currentDayNames = language === "ko" ? dayNames.ko : dayNames.en;

    const matrix = useMemo(() => buildCalendarMatrix(monthKey), [monthKey]);
    const eventMap = useMemo(() => {
        return events.reduce<Record<string, TodoListEvent[]>>((acc, event) => {
            if (!acc[event.dateKey]) {
                acc[event.dateKey] = [];
            }
            acc[event.dateKey].push(event);
            return acc;
        }, {});
    }, [events]);

    const selectedEvents = eventMap[selectedDateKey] ?? [];

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);
        try {
            await onCreateEvent({
                title: title.trim(),
                friends: parseFriends(friends),
                memo: memo.trim() ? memo.trim() : undefined,
            });
            setTitle("");
            setFriends("");
            setMemo("");
            setDialogOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveEvent = async (eventId: string) => {
        await onRemoveEvent(eventId);
    };

    const handleSelectDate = (dateKey: string) => {
        onSelectDate(dateKey);
    };

    const monthLabel = useMemo(() => formatKstMonthLabel(monthKey, language), [monthKey, language]);
    const selectedLabel = useMemo(
        () => formatKstDateLabel(selectedDateKey, language),
        [selectedDateKey, language],
    );

    const monthLimits = useMemo(() => {
        const [yearStr, monthStr] = monthKey.split("-");
        const year = Number(yearStr);
        const month = Number(monthStr);
        if (Number.isNaN(year) || Number.isNaN(month)) {
            return { min: undefined as string | undefined, max: undefined as string | undefined };
        }
        const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
        return {
            min: `${yearStr}-${monthStr}-01`,
            max: `${yearStr}-${monthStr}-${String(lastDay).padStart(2, "0")}`,
        };
    }, [monthKey]);

    const handleOpenEdit = (event: TodoListEvent) => {
        setEditingEventId(event.id);
        setEditTitle(event.title);
        setEditFriends(event.friends.join(", "));
        setEditMemo(event.memo ?? "");
        setEditDate(event.dateKey);
        setEditDialogOpen(true);
    };

    const handleCloseEdit = () => {
        setEditingEventId(null);
        setEditTitle("");
        setEditFriends("");
        setEditMemo("");
        setEditDate(selectedDateKey);
        setEditDialogOpen(false);
        setIsEditing(false);
    };

    const handleSubmitEdit = async () => {
        if (!editingEventId || !editTitle.trim() || !editDate) {
            return;
        }
        setIsEditing(true);
        try {
            await onUpdateEvent(editingEventId, {
                title: editTitle.trim(),
                friends: parseFriends(editFriends),
                memo: editMemo.trim() ? editMemo.trim() : undefined,
                dateKey: editDate,
            });
            setEditDialogOpen(false);
            setEditingEventId(null);
            if (editDate !== selectedDateKey) {
                onSelectDate(editDate);
            }
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-40">
                <CalendarRange className="absolute -top-10 -right-10 h-48 w-48 text-primary/20" />
            </div>
            <CardHeader className="relative z-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t("todoList.calendar.title")}
                        </CardTitle>
                        <CardDescription>{t("todoList.calendar.description")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
                        {t("todoList.calendar.friendBadge")}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-4 rounded-xl border bg-background/60 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-full border p-0"
                            onClick={() => onMonthChange(-1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                            <p className="text-sm uppercase tracking-wider text-muted-foreground">
                                {t("todoList.calendar.currentMonth")}
                            </p>
                            <p className="text-xl font-semibold">{monthLabel}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-full border p-0"
                            onClick={() => onMonthChange(1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-muted-foreground">
                        {currentDayNames.map((dayName) => (
                            <div key={dayName}>{dayName}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {matrix.flat().map((day) => {
                            const dayEvents = eventMap[day.dateKey] ?? [];
                            const isSelected = day.dateKey === selectedDateKey;
                            const displayDate = Number(day.dateKey.split("-")[2]);
                            return (
                                <button
                                    type="button"
                                    key={day.dateKey}
                                    onClick={() => handleSelectDate(day.dateKey)}
                                    className={cn(
                                        "group flex h-20 flex-col justify-between rounded-xl border p-2 text-left text-sm transition",
                                        day.isCurrentMonth
                                            ? "bg-background/90 text-foreground"
                                            : "bg-muted/40 text-muted-foreground/80",
                                        day.isToday ? "border-primary" : "border-border/60",
                                        isSelected
                                            ? "ring-2 ring-primary/60"
                                            : "hover:border-primary/40 hover:ring-2 hover:ring-primary/20",
                                    )}
                                >
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span>{displayDate}</span>
                                        {day.isToday ? (
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                {t("todoList.calendar.today")}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {dayEvents.slice(0, 3).map((event) => (
                                            <span
                                                key={event.id}
                                                className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                                            >
                                                {event.title}
                                            </span>
                                        ))}
                                        {dayEvents.length > 3 ? (
                                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                                +{dayEvents.length - 3}
                                            </span>
                                        ) : null}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex h-full flex-col justify-between gap-4 rounded-xl border bg-background/60 p-4 shadow-sm">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t("todoList.calendar.selectedDate")}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground">{selectedLabel}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t("todoList.calendar.selectedDescription")}
                        </p>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="space-y-3 pr-2">
                            {selectedEvents.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    {t("todoList.calendar.empty")}
                                </div>
                            ) : (
                                selectedEvents.map((event) => (
                                    <div key={event.id} className="rounded-lg border bg-background/80 p-3 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold">{event.title}</p>
                                                {event.memo ? (
                                                    <p className="mt-1 text-sm text-muted-foreground">{event.memo}</p>
                                                ) : null}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-xs text-muted-foreground"
                                                    onClick={() => handleOpenEdit(event)}
                                                >
                                                    <Pencil className="mr-1 h-3.5 w-3.5" />
                                                    {t("todoList.calendar.edit")}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                                                    onClick={() => handleRemoveEvent(event.id)}
                                                >
                                                    {t("todoList.calendar.remove")}
                                                </Button>
                                            </div>
                                        </div>
                                        {event.friends.length ? (
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <Users className="h-3.5 w-3.5" />
                                                {event.friends.map((friend) => (
                                                    <Badge
                                                        key={`${event.id}-${friend}`}
                                                        variant="secondary"
                                                        className="bg-muted text-foreground"
                                                    >
                                                        {friend}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                {t("todoList.calendar.addEvent")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{t("todoList.calendar.dialog.title")}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {t("todoList.calendar.dialog.titleLabel")}
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder={t("todoList.calendar.dialog.titlePlaceholder")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {t("todoList.calendar.dialog.friendLabel")}
                                    </label>
                                    <textarea
                                        value={friends}
                                        onChange={(event) => setFriends(event.target.value)}
                                        className="min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        placeholder={t("todoList.calendar.dialog.friendPlaceholder")}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t("todoList.calendar.dialog.friendHelp")}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {t("todoList.calendar.dialog.memoLabel")}
                                    </label>
                                    <textarea
                                        value={memo}
                                        onChange={(event) => setMemo(event.target.value)}
                                        className="min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        placeholder={t("todoList.calendar.dialog.memoPlaceholder")}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleSubmit}
                                    className="w-full"
                                    disabled={isSubmitting || !title.trim()}
                                >
                                    {isSubmitting
                                        ? t("todoList.calendar.dialog.saving")
                                        : t("todoList.calendar.dialog.save")}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) handleCloseEdit(); }}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{t("todoList.calendar.dialog.editTitle")}</DialogTitle>
                                <DialogDescription>{t("todoList.calendar.dialog.dateHelp")}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {t("todoList.calendar.dialog.titleLabel")}
                                    </label>
                                    <Input
                                        value={editTitle}
                                        onChange={(event) => setEditTitle(event.target.value)}
                                        placeholder={t("todoList.calendar.dialog.titlePlaceholder")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {t("todoList.calendar.dialog.friendLabel")}
                                    </label>
                                    <textarea
                                        value={editFriends}
                                        onChange={(event) => setEditFriends(event.target.value)}
                                        className="min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        placeholder={t("todoList.calendar.dialog.friendPlaceholder")}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t("todoList.calendar.dialog.friendHelp")}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {t("todoList.calendar.dialog.memoLabel")}
                                    </label>
                                    <textarea
                                        value={editMemo}
                                        onChange={(event) => setEditMemo(event.target.value)}
                                        className="min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        placeholder={t("todoList.calendar.dialog.memoPlaceholder")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground" htmlFor="event-edit-date">
                                        {t("todoList.calendar.dialog.dateLabel")}
                                    </label>
                                    <Input
                                        id="event-edit-date"
                                        type="date"
                                        value={editDate}
                                        min={monthLimits.min}
                                        max={monthLimits.max}
                                        onChange={(event) => setEditDate(event.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        {t("common.cancel")}
                                    </Button>
                                </DialogClose>
                                <Button
                                    onClick={handleSubmitEdit}
                                    disabled={isEditing || !editTitle.trim() || !editDate}
                                    className="w-full sm:w-auto"
                                >
                                    {isEditing
                                        ? t("todoList.calendar.dialog.editSaving")
                                        : t("todoList.calendar.dialog.update")}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
};

export default CalendarPanel;
