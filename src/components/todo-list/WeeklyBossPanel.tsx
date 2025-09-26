"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    TODO_LIST_BOSS_GROUPS,
    TODO_LIST_BOSS_MAP,
    TodoListBoss,
    TodoListBossGroup,
    BossFrequency,
    WEEKLY_CHARACTER_CLEAR_LIMIT,
    WEEKLY_WORLD_CLEAR_LIMIT,
} from "@/constants/todoList";
import {
    MonthlyBossState,
    WeeklyBossCharacterState,
    WeeklyBossState,
    TODO_LIST_UNASSIGNED_CHARACTER_KEY,
    TODO_LIST_UNASSIGNED_WORLD_KEY,
} from "@/fetchs/todoList.fetch";
import { ICharacterSummary } from "@/interface/character/ICharacterSummary";
import { useLanguage, useTranslations } from "@/providers/LanguageProvider";
import { cn } from "@/utils/utils";

interface WeeklyBossPanelProps {
    weeklyState: WeeklyBossState;
    monthlyState: MonthlyBossState;
    characters: ICharacterSummary[];
    charactersLoading: boolean;
    onToggleWeekly: (world: string, characterId: string, bossId: string, next: boolean) => void;
    onToggleMonthly: (bossId: string, next: boolean) => void;
}

type AggregatedBoss = {
    name: string;
    bosses: TodoListBoss[];
};

type AggregatedBossGroup = TodoListBossGroup & {
    aggregatedBosses: AggregatedBoss[];
};

type CharacterOption = {
    id: string;
    name: string;
    helper?: string;
    isVirtual: boolean;
};

type CharacterEarning = CharacterOption & {
    reward: number;
    clears: number;
};

const FREQUENCY_ORDER: BossFrequency[] = ["daily", "weekly", "monthly"];

const isWeeklyBossId = (bossId: string) => TODO_LIST_BOSS_MAP[bossId]?.frequency === "weekly";

const countWeeklyClears = (character: WeeklyBossCharacterState) =>
    Object.entries(character).reduce((acc, [bossId, state]) => {
        if (state?.clearedAt && isWeeklyBossId(bossId)) {
            return acc + 1;
        }
        return acc;
    }, 0);

const DIFFICULTY_LABEL_KEY_MAP: Record<TodoListBoss["difficulty"], string> = {
    Easy: "easy",
    Normal: "normal",
    Hard: "hard",
    Chaos: "chaos",
    Extreme: "extreme",
};

const WORLD_STORAGE_KEY = "todoList:selectedWorld";

const WeeklyBossPanel = ({
    weeklyState,
    monthlyState,
    characters,
    charactersLoading,
    onToggleWeekly,
    onToggleMonthly,
}: WeeklyBossPanelProps) => {
    const t = useTranslations();
    const { language } = useLanguage();
    const [selectedWorld, setSelectedWorld] = useState<string>(() => {
        if (typeof window === "undefined") {
            return TODO_LIST_UNASSIGNED_WORLD_KEY;
        }
        return window.localStorage.getItem(WORLD_STORAGE_KEY) ?? TODO_LIST_UNASSIGNED_WORLD_KEY;
    });
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState<BossFrequency>("weekly");

    const aggregatedGroups = useMemo<AggregatedBossGroup[]>(() => {
        const difficultyGroups = TODO_LIST_BOSS_GROUPS.map((group) => {
            const uniqueBossMap = new Map<string, AggregatedBoss>();
            const aggregated: AggregatedBoss[] = [];

            group.bosses.forEach((boss) => {
                const key = boss.bossName || boss.label;
                if (!uniqueBossMap.has(key)) {
                    uniqueBossMap.set(key, { name: key, bosses: [] });
                    aggregated.push(uniqueBossMap.get(key)!);
                }
                uniqueBossMap.get(key)!.bosses.push(boss);
            });

            return {
                ...group,
                aggregatedBosses: aggregated,
            } satisfies AggregatedBossGroup;
        });

        return difficultyGroups;
    }, []);

    const aggregatedChecklistBosses = useMemo(
        () =>
            aggregatedGroups
                .filter((group) => group.frequency !== "monthly")
                .flatMap((group) => group.aggregatedBosses),
        [aggregatedGroups],
    );

    const frequencyGroups = useMemo(() => {
        return aggregatedGroups.reduce<Record<BossFrequency, AggregatedBossGroup[]>>(
            (acc, group) => {
                if (!acc[group.frequency]) {
                    acc[group.frequency] = [];
                }
                acc[group.frequency].push(group);
                return acc;
            },
            { daily: [], weekly: [], monthly: [] },
        );
    }, [aggregatedGroups]);

    const worldOptions = useMemo(() => {
        const locales = language === "ko" ? "ko-KR" : "en-US";
        const set = new Set<string>([TODO_LIST_UNASSIGNED_WORLD_KEY]);
        characters.forEach((character) => {
            if (character.world_name) {
                set.add(character.world_name);
            }
        });
        Object.keys(weeklyState.worlds).forEach((world) => set.add(world));
        const worlds = Array.from(set);
        const actualWorlds = worlds
            .filter((world) => world !== TODO_LIST_UNASSIGNED_WORLD_KEY)
            .sort((a, b) => a.localeCompare(b, locales));
        return [...actualWorlds, TODO_LIST_UNASSIGNED_WORLD_KEY];
    }, [characters, language, weeklyState.worlds]);

    useEffect(() => {
        if (worldOptions.length === 0) {
            setSelectedWorld(TODO_LIST_UNASSIGNED_WORLD_KEY);
            return;
        }

        if (!selectedWorld || !worldOptions.includes(selectedWorld)) {
            setSelectedWorld(worldOptions[0]);
        }
    }, [selectedWorld, worldOptions]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (selectedWorld) {
            window.localStorage.setItem(WORLD_STORAGE_KEY, selectedWorld);
        } else {
            window.localStorage.removeItem(WORLD_STORAGE_KEY);
        }
    }, [selectedWorld]);

    const worldState = useMemo(() => weeklyState.worlds[selectedWorld] ?? {}, [selectedWorld, weeklyState.worlds]);

    const characterOptions = useMemo<CharacterOption[]>(() => {
        if (!selectedWorld) {
            return [];
        }

        const rosterOptions: CharacterOption[] = characters
            .filter((character) => character.world_name === selectedWorld)
            .map((character) => ({
                id: character.ocid,
                name: character.character_name,
                helper: t("todoList.bosses.characterEarnings.helper", {
                    level: character.character_level,
                    job: character.character_class,
                }),
                isVirtual: false,
            }));

        const existingIds = new Set(rosterOptions.map((option) => option.id));
        const extraOptions: CharacterOption[] = Object.keys(worldState)
            .filter((characterId) => !existingIds.has(characterId))
            .map((characterId) => ({
                id: characterId,
                name:
                    characterId === TODO_LIST_UNASSIGNED_CHARACTER_KEY
                        ? t("todoList.bosses.selectors.character.unassigned")
                        : characterId,
                isVirtual: true,
            }));

        const combined = [...rosterOptions, ...extraOptions];

        if (combined.length === 0) {
            combined.push({
                id: TODO_LIST_UNASSIGNED_CHARACTER_KEY,
                name: t("todoList.bosses.selectors.character.unassigned"),
                isVirtual: true,
            });
        }

        return combined;
    }, [characters, selectedWorld, t, worldState]);

    useEffect(() => {
        if (!selectedWorld) {
            setSelectedCharacter(null);
            return;
        }

        if (characterOptions.length === 0) {
            setSelectedCharacter(null);
            return;
        }

        if (!selectedCharacter || !characterOptions.some((option) => option.id === selectedCharacter)) {
            setSelectedCharacter(characterOptions[0].id);
        }
    }, [characterOptions, selectedCharacter, selectedWorld]);

    const selectedCharacterState = useMemo<WeeklyBossCharacterState>(() => {
        if (!selectedWorld || !selectedCharacter) {
            return {};
        }
        return worldState[selectedCharacter] ?? {};
    }, [selectedCharacter, selectedWorld, worldState]);

    const formatCurrency = useCallback(
        (value: number) => {
            const isKorean = language === "ko";
            const formatter = new Intl.NumberFormat(isKorean ? "ko-KR" : "en-US", {
                maximumFractionDigits: isKorean ? 0 : 1,
            });
            const divisor = isKorean ? 10_000 : 1_000_000;
            const formatted = formatter.format(value / divisor);
            return isKorean ? `${formatted}만` : `${formatted} M`;
        },
        [language],
    );

    const computeCharacterStats = useCallback(
        (state: WeeklyBossCharacterState | undefined) => {
            const bossState = state ?? {};
            const clears = aggregatedChecklistBosses.filter((boss) =>
                boss.bosses.some((entry) => Boolean(bossState[entry.id]?.clearedAt)),
            ).length;
            const reward = aggregatedChecklistBosses.reduce((acc, boss) => {
                const cleared = boss.bosses.find((entry) => Boolean(bossState[entry.id]?.clearedAt));
                if (cleared) {
                    return acc + cleared.reward;
                }
                return acc;
            }, 0);
            const totalBosses = aggregatedChecklistBosses.length;
            const progress = totalBosses === 0 ? 0 : Math.round((clears / totalBosses) * 100);

            return { clears, reward, totalBosses, progress };
        },
        [aggregatedChecklistBosses],
    );

    const selectedCharacterStats = computeCharacterStats(selectedCharacterState);

    const characterEarnings = useMemo<CharacterEarning[]>(() => {
        if (!selectedWorld) {
            return [];
        }

        return characterOptions
            .map<CharacterEarning>((option) => {
                const stats = computeCharacterStats(worldState[option.id]);
                return {
                    ...option,
                    reward: stats.reward,
                    clears: stats.clears,
                };
            })
            .sort((a, b) => b.reward - a.reward);
    }, [characterOptions, computeCharacterStats, selectedWorld, worldState]);

    const worldSummary = useMemo(() => {
        return Object.values(worldState).reduce(
            (acc, state) => {
                const stats = computeCharacterStats(state);
                return {
                    reward: acc.reward + stats.reward,
                    clears: acc.clears + stats.clears,
                };
            },
            { reward: 0, clears: 0 },
        );
    }, [computeCharacterStats, worldState]);

    const selectedWorldLabel =
        selectedWorld === TODO_LIST_UNASSIGNED_WORLD_KEY
            ? t("todoList.bosses.selectors.world.unassigned")
            : selectedWorld;

    const selectedCharacterWeeklyCount = useMemo(
        () => countWeeklyClears(selectedCharacterState),
        [selectedCharacterState],
    );

    const selectedWorldWeeklyCount = useMemo(
        () =>
            Object.values(worldState).reduce(
                (acc, characterState) => acc + countWeeklyClears(characterState),
                0,
            ),
        [worldState],
    );

    const renderGroup = useCallback(
        (group: AggregatedBossGroup) => {
            return (
                <div key={group.id} className="space-y-3 rounded-2xl border bg-background/70 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {t(`todoList.bosses.frequency.${group.frequency}`)}
                            </p>
                            <h3 className="text-lg font-semibold text-foreground">
                                {t(`todoList.bosses.groups.${group.id}.title`)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t(`todoList.bosses.groups.${group.id}.description`)}
                            </p>
                        </div>
                        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                            {t("todoList.bosses.groupBadge", { count: group.bosses.length })}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {group.aggregatedBosses.map((boss) => {
                            const key = boss.bosses[0]?.id ?? boss.name;
                            const isMonthly = group.frequency === "monthly";
                            const getCleared = (bossId: string) =>
                                isMonthly
                                    ? Boolean(monthlyState[bossId]?.clearedAt)
                                    : Boolean(selectedCharacter && selectedCharacterState[bossId]?.clearedAt);
                            const anyCleared = boss.bosses.some((entry) => getCleared(entry.id));
                            const clearedEntry = boss.bosses.find((entry) => getCleared(entry.id));

                            const handleToggleDifficulty = (entry: TodoListBoss, next: boolean) => {
                                if (isMonthly) {
                                    if (next) {
                                        boss.bosses.forEach((other) => {
                                            if (other.id !== entry.id && Boolean(monthlyState[other.id]?.clearedAt)) {
                                                onToggleMonthly(other.id, false);
                                            }
                                        });
                                        onToggleMonthly(entry.id, true);
                                    } else {
                                        onToggleMonthly(entry.id, false);
                                    }
                                } else if (selectedWorld && selectedCharacter) {
                                    if (next) {
                                        boss.bosses.forEach((other) => {
                                            if (
                                                other.id !== entry.id &&
                                                Boolean(selectedCharacterState[other.id]?.clearedAt)
                                            ) {
                                                onToggleWeekly(selectedWorld, selectedCharacter, other.id, false);
                                            }
                                        });
                                        onToggleWeekly(selectedWorld, selectedCharacter, entry.id, true);
                                    } else {
                                        onToggleWeekly(selectedWorld, selectedCharacter, entry.id, false);
                                    }
                                }
                            };

                            return (
                                <div
                                    key={key}
                                    className={cn(
                                        "flex flex-col gap-3 rounded-xl border px-4 py-3 transition",
                                        anyCleared
                                            ? "border-primary/70 bg-primary/10"
                                            : "border-border/70 bg-background/70 hover:border-primary/40",
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{boss.name}</p>
                                            {clearedEntry ? (
                                                <p className="text-xs text-muted-foreground">
                                                    {t("todoList.bosses.rewardLabel", {
                                                        value: formatCurrency(clearedEntry.reward),
                                                    })}
                                                </p>
                                            ) : null}
                                        </div>
                                        <Badge
                                            variant={anyCleared ? "default" : "outline"}
                                            className={cn(
                                                "rounded-full px-3 py-1 text-[11px] font-semibold",
                                                anyCleared
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground",
                                            )}
                                        >
                                            {anyCleared
                                                ? t("todoList.bosses.status.done")
                                                : t("todoList.bosses.status.todo")}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {boss.bosses.map((entry) => {
                                            const cleared = getCleared(entry.id);
                                            const disabled =
                                                isMonthly
                                                    ? anyCleared && !cleared
                                                    : !selectedCharacter || (anyCleared && !cleared);
                                            const difficultyKey = DIFFICULTY_LABEL_KEY_MAP[entry.difficulty];
                                            const difficultyLabel = t(
                                                `todoList.bosses.difficulties.${difficultyKey}`,
                                            );

                                            const otherCleared = boss.bosses.some(
                                                (other) =>
                                                    other.id !== entry.id &&
                                                    Boolean(selectedCharacterState[other.id]?.clearedAt),
                                            );

                                            const wouldExceedCharacterLimit =
                                                !cleared &&
                                                entry.frequency === "weekly" &&
                                                !otherCleared &&
                                                selectedCharacterWeeklyCount >= WEEKLY_CHARACTER_CLEAR_LIMIT;

                                            const wouldExceedWorldLimit =
                                                !cleared &&
                                                entry.frequency === "weekly" &&
                                                !otherCleared &&
                                                selectedWorldWeeklyCount >= WEEKLY_WORLD_CLEAR_LIMIT;

                                            const wouldExceedLimit =
                                                wouldExceedCharacterLimit || wouldExceedWorldLimit;

                                            return (
                                                <Button
                                                    key={entry.id}
                                                    type="button"
                                                    variant={cleared ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={disabled}
                                                    onClick={() => handleToggleDifficulty(entry, !cleared)}
                                                    className={cn(
                                                        "h-8 rounded-full px-3 text-xs font-semibold",
                                                        !cleared && "text-muted-foreground",
                                                        wouldExceedLimit && "ring-1 ring-destructive/60",
                                                    )}
                                                    title={
                                                        wouldExceedCharacterLimit
                                                            ? t("todoList.toast.weeklyCharacterLimit", {
                                                                  limit: WEEKLY_CHARACTER_CLEAR_LIMIT,
                                                              })
                                                            : wouldExceedWorldLimit
                                                            ? t("todoList.toast.weeklyWorldLimit", {
                                                                  limit: WEEKLY_WORLD_CLEAR_LIMIT,
                                                              })
                                                            : t("todoList.bosses.rewardLabel", {
                                                                  value: formatCurrency(entry.reward),
                                                              })
                                                    }
                                                >
                                                    {`${difficultyLabel} · ${formatCurrency(entry.reward)}`}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        },
        [
            formatCurrency,
            monthlyState,
            onToggleMonthly,
            onToggleWeekly,
            selectedCharacter,
            selectedCharacterState,
            selectedCharacterWeeklyCount,
            selectedWorld,
            selectedWorldWeeklyCount,
            t,
        ],
    );

    return (
        <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <Trophy className="absolute -top-12 -left-12 h-48 w-48 rotate-12 text-primary/20" />
                <Zap className="absolute -bottom-12 -right-10 h-40 w-40 -rotate-12 text-primary/10" />
            </div>
            <CardHeader className="relative z-10 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t("todoList.bosses.title")}
                        </CardTitle>
                        <CardDescription>{t("todoList.bosses.description")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {t("todoList.bosses.resetInfo")}
                    </Badge>
                </div>
                <div className="grid gap-3 rounded-xl border bg-background/60 p-4 shadow-sm sm:grid-cols-4">
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.clears")}
                        </p>
                        <p className="text-xl font-semibold text-foreground">
                            {selectedCharacterStats.clears}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t("todoList.bosses.summary.total", { value: selectedCharacterStats.totalBosses })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.reward")}
                        </p>
                        <p className="text-xl font-semibold text-primary">
                            {formatCurrency(selectedCharacterStats.reward)}
                        </p>
                        <p className="text-xs text-muted-foreground">{t("todoList.bosses.summary.rewardHint")}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.progress")}
                        </p>
                        <p className="text-xl font-semibold text-foreground">
                            {selectedCharacterStats.progress}%
                        </p>
                        <p className="text-xs text-muted-foreground">{t("todoList.bosses.summary.progressHint")}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-muted-foreground">
                            {t("todoList.bosses.summary.worldReward", { world: selectedWorldLabel })}
                        </p>
                        <p className="text-xl font-semibold text-primary">
                            {formatCurrency(worldSummary.reward)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t("todoList.bosses.summary.worldRewardHint")}
                        </p>
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("todoList.bosses.selectors.world.label")}
                        </p>
                        <Select value={selectedWorld} onValueChange={setSelectedWorld} disabled={worldOptions.length === 0}>
                            <SelectTrigger className="h-12 w-full rounded-xl border-border/60 bg-background/80 px-5 text-sm shadow-sm">
                                <SelectValue placeholder={t("todoList.bosses.selectors.world.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {worldOptions.map((world) => (
                                    <SelectItem key={world} value={world}>
                                        {world === TODO_LIST_UNASSIGNED_WORLD_KEY
                                            ? t("todoList.bosses.selectors.world.unassigned")
                                            : world}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("todoList.bosses.selectors.character.label")}
                        </p>
                        <Select
                            value={selectedCharacter ?? undefined}
                            onValueChange={setSelectedCharacter}
                            disabled={characterOptions.length === 0 || charactersLoading}
                        >
                            <SelectTrigger className="h-12 w-full rounded-xl border-border/60 bg-background/80 px-5 text-sm shadow-sm">
                                <SelectValue placeholder={t("todoList.bosses.selectors.character.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {characterOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.helper ? `${option.name} · ${option.helper}` : option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                {t("todoList.bosses.characterEarnings.title")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t("todoList.bosses.characterEarnings.description", { world: selectedWorldLabel })}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                                {t("todoList.bosses.characterEarnings.totalLabel", {
                                    value: formatCurrency(worldSummary.reward),
                                })}
                            </Badge>
                            <Dialog open={earningsDialogOpen} onOpenChange={setEarningsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-full"
                                        disabled={characterEarnings.length === 0}
                                    >
                                        {t("todoList.bosses.characterEarnings.openDialog")}
                                    </Button>
                                </DialogTrigger>
                                {characterEarnings.length > 0 ? (
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader className="space-y-1">
                                            <DialogTitle>
                                                {t("todoList.bosses.characterEarnings.dialogTitle")}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t("todoList.bosses.characterEarnings.dialogDescription", {
                                                    world: selectedWorldLabel,
                                                })}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="max-h-[420px] pr-4">
                                            <div className="space-y-3">
                                                {characterEarnings.map((entry) => (
                                                    <div
                                                        key={entry.id}
                                                        className={cn(
                                                            "flex items-center justify-between gap-4 rounded-xl border px-4 py-3",
                                                            entry.id === selectedCharacter
                                                                ? "border-primary/70 bg-primary/10"
                                                                : "border-border/70 bg-background/80",
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {entry.name}
                                                            </p>
                                                            {entry.helper ? (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {entry.helper}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-primary">
                                                                {formatCurrency(entry.reward)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {t("todoList.bosses.characterEarnings.clears", {
                                                                    count: entry.clears,
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                        <DialogFooter>
                                            <Badge variant="secondary" className="w-fit">
                                                {t("todoList.bosses.characterEarnings.characterCount", {
                                                    count: characterEarnings.length,
                                                })}
                                            </Badge>
                                        </DialogFooter>
                                    </DialogContent>
                                ) : null}
                            </Dialog>
                        </div>
                    </div>
                    {characterEarnings.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            {t("todoList.bosses.characterEarnings.empty")}
                        </p>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
                <Tabs value={selectedFrequency} onValueChange={(value) => setSelectedFrequency(value as BossFrequency)}>
                    <TabsList className="bg-background/80">
                        {FREQUENCY_ORDER.filter((frequency) => frequencyGroups[frequency]?.length).map((frequency) => (
                            <TabsTrigger key={frequency} value={frequency} className="min-w-[96px]">
                                {t(`todoList.bosses.frequency.${frequency}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {FREQUENCY_ORDER.map((frequency) => {
                        const groups = frequencyGroups[frequency];
                        if (!groups || groups.length === 0) {
                            return null;
                        }
                        return (
                            <TabsContent key={frequency} value={frequency} className="mt-4">
                                <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                                    {groups.map((group) => renderGroup(group))}
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
                {selectedWorldWeeklyCount >= WEEKLY_WORLD_CLEAR_LIMIT ? (
                    <p className="text-xs text-destructive">
                        {t("todoList.toast.weeklyWorldLimit", { limit: WEEKLY_WORLD_CLEAR_LIMIT })}
                    </p>
                ) : null}
                {selectedCharacterWeeklyCount >= WEEKLY_CHARACTER_CLEAR_LIMIT ? (
                    <p className="text-xs text-destructive">
                        {t("todoList.toast.weeklyCharacterLimit", { limit: WEEKLY_CHARACTER_CLEAR_LIMIT })}
                    </p>
                ) : null}
            </CardContent>
        </Card>
    );
};

export default WeeklyBossPanel;
