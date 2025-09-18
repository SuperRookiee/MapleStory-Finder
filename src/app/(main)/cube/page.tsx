"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findCubeHistory } from "@/fetchs/history.fetch";
import { CubeHistoryEntry, PotentialOption } from "@/interface/history/IHistory";
import { useTranslations } from "@/providers/LanguageProvider";

const getTodayKstDate = () => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60_000;
    const kst = new Date(utcTime + 9 * 60 * 60_000);
    return kst.toISOString().slice(0, 10);
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString();
};

const isActiveFlag = (value?: string | null) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    return !["n", "미적용", "없음", "false", "0"].includes(normalized);
};

const renderOptions = (
    label: string,
    options: PotentialOption[] = [],
    emptyLabel: string,
) => {
    if (!options.length) {
        return (
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{emptyLabel}</p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <ul className="mt-1 space-y-1 text-xs">
                {options.map((option, index) => (
                    <li key={`${label}-${index}`} className="flex flex-wrap items-center gap-1">
                        <span className="text-foreground">{option.value}</span>
                        {option.grade && (
                            <span className="text-muted-foreground">({option.grade})</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CubePage = () => {
    const t = useTranslations();
    const [date, setDate] = useState(getTodayKstDate());
    const [countInput, setCountInput] = useState("20");
    const [entries, setEntries] = useState<CubeHistoryEntry[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [lastParams, setLastParams] = useState<{ count: number; date?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [totalFetched, setTotalFetched] = useState(0);

    const fetchHistory = useCallback(
        async (
            baseParams: { count: number; date?: string },
            options: { cursor?: string | null; append: boolean },
        ) => {
            if (options.append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            try {
                const response = await findCubeHistory({
                    ...baseParams,
                    ...(options.cursor ? { cursor: options.cursor } : {}),
                });
                const payload = response.data;
                const history = payload.cube_history ?? [];

                setEntries((prev) => (options.append ? [...prev, ...history] : history));
                setNextCursor(payload.next_cursor ?? null);
                setHasSearched(true);
                setTotalFetched((prev) => (options.append ? prev + history.length : history.length));

                if (!options.append) {
                    setLastParams(baseParams);
                }
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : t("history.common.error");
                toast.error(message);
            } finally {
                if (options.append) {
                    setIsLoadingMore(false);
                } else {
                    setIsLoading(false);
                }
            }
        },
        [t],
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedCount = Number(countInput);

        if (!Number.isInteger(parsedCount) || parsedCount < 10 || parsedCount > 1000) {
            toast.error(t("history.common.countError"));
            return;
        }

        const baseParams: { count: number; date?: string } = {
            count: parsedCount,
        };

        if (date) {
            baseParams.date = date;
        }

        await fetchHistory(baseParams, { append: false });
    };

    const handleLoadMore = async () => {
        if (!nextCursor || !lastParams) return;
        await fetchHistory(lastParams, { append: true, cursor: nextCursor });
    };

    const flagBadges = useCallback(
        (entry: CubeHistoryEntry) => {
            const badges: JSX.Element[] = [];

            if (isActiveFlag(entry.miracle_time_flag)) {
                badges.push(
                    <Badge key="miracle" variant="secondary">
                        {t("history.cube.flags.miracleTime")}
                    </Badge>,
                );
            }

            if (entry.upgrade_guarantee) {
                badges.push(
                    <Badge key="guarantee" variant="secondary">
                        {t("history.cube.flags.guaranteed")}
                    </Badge>,
                );
            }

            if (entry.upgrade_guarantee_count > 0) {
                badges.push(
                    <Badge key="guarantee-count" variant="outline">
                        {t("history.cube.flags.stacks", { count: entry.upgrade_guarantee_count })}
                    </Badge>,
                );
            }

            return badges;
        },
        [t],
    );

    const renderContent = useMemo(() => {
        if (isLoading && entries.length === 0) {
            return (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </div>
            );
        }

        if (entries.length === 0) {
            return (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    {hasSearched ? t("history.common.empty") : t("history.common.initial")}
                </div>
            );
        }

        return (
            <div className="grid gap-4">
                {entries.map((entry) => {
                    const beforeMain = entry.before_potential_option ?? [];
                    const afterMain = entry.after_potential_option ?? [];
                    const beforeAdditional = entry.before_additional_potential_option ?? [];
                    const afterAdditional = entry.after_additional_potential_option ?? [];

                    return (
                        <Card key={entry.id} className="border border-border/60">
                            <CardHeader className="pb-0">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">
                                            {entry.target_item}
                                        </CardTitle>
                                        <CardDescription className="flex flex-col gap-0.5 text-xs">
                                            <span>
                                                {entry.character_name}
                                                {entry.world_name ? ` · ${entry.world_name}` : ""}
                                            </span>
                                            <span>{formatDateTime(entry.date_create)}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge>{entry.cube_type}</Badge>
                                        <Badge variant="outline">{entry.item_upgrade_result}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-6 pt-4 text-sm">
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    {entry.item_equipment_part && (
                                        <span>
                                            {t("history.cube.labels.part", { part: entry.item_equipment_part })}
                                        </span>
                                    )}
                                    {typeof entry.item_level === "number" && entry.item_level > 0 && (
                                        <span>
                                            {t("history.cube.labels.level", { level: entry.item_level })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {entry.potential_option_grade && (
                                        <Badge variant="outline">
                                            {t("history.cube.labels.potential", {
                                                grade: entry.potential_option_grade,
                                            })}
                                        </Badge>
                                    )}
                                    {entry.additional_potential_option_grade && (
                                        <Badge variant="outline">
                                            {t("history.cube.labels.additionalPotential", {
                                                grade: entry.additional_potential_option_grade,
                                            })}
                                        </Badge>
                                    )}
                                    {flagBadges(entry)}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {renderOptions(
                                        t("history.cube.labels.beforePotential"),
                                        beforeMain,
                                        t("history.cube.emptyOption"),
                                    )}
                                    {renderOptions(
                                        t("history.cube.labels.afterPotential"),
                                        afterMain,
                                        t("history.cube.emptyOption"),
                                    )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {renderOptions(
                                        t("history.cube.labels.beforeAdditional"),
                                        beforeAdditional,
                                        t("history.cube.emptyOption"),
                                    )}
                                    {renderOptions(
                                        t("history.cube.labels.afterAdditional"),
                                        afterAdditional,
                                        t("history.cube.emptyOption"),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    }, [entries, flagBadges, hasSearched, isLoading, t]);

    return (
        <ScrollArea className="h-page">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-1 pb-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">
                        {t("history.cube.title")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("history.cube.description")}
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr))]"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="date">
                                    {t("history.common.form.date")}
                                </label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    max={getTodayKstDate()}
                                    onChange={(event) => setDate(event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="count">
                                    {t("history.common.form.count")}
                                </label>
                                <Input
                                    id="count"
                                    type="number"
                                    min={10}
                                    max={1000}
                                    value={countInput}
                                    onChange={(event) => setCountInput(event.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t("history.common.form.countHint")}
                                </p>
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                            {t("history.common.form.loading")}
                                        </>
                                    ) : (
                                        t("history.common.form.submit")
                                    )}
                                </Button>
                            </div>
                            {totalFetched > 0 && (
                                <div className="flex items-end text-sm text-muted-foreground">
                                    {t("history.common.form.result", { count: totalFetched })}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
                {renderContent}
                {nextCursor && entries.length > 0 && (
                    <div className="flex justify-center">
                        <Button onClick={handleLoadMore} disabled={isLoadingMore || isLoading}>
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                    {t("history.common.form.loading")}
                                </>
                            ) : (
                                t("history.common.form.loadMore")
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default CubePage;
