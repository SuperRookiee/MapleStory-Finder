import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Home, Search, Sparkles } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SUGGESTIONS = [
    {
        title: "랜딩으로 이동",
        description: "Finder 소개 페이지에서 제공하는 주요 기능과 소식을 확인해 보세요.",
        href: "/",
        cta: "메인 살펴보기",
        Icon: Compass,
    },
    {
        title: "캐릭터 검색",
        description: "월드와 닉네임만 입력하면 실시간으로 캐릭터 정보를 확인할 수 있어요.",
        href: "/search",
        cta: "바로 검색하기",
        Icon: Search,
    },
    {
        title: "즐겨찾기 관리",
        description: "로그인 후 자주 보는 캐릭터를 저장하고 한곳에서 관리해 보세요.",
        href: "/home",
        cta: "즐겨찾기 이동",
        Icon: Sparkles,
    },
] as const;

const NotFound = () => {
    return (
        <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
            <DarkModeToggle className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6" />

            <div
                aria-hidden
                className="pointer-events-none absolute -left-1/3 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(132,90,223,0.18),_transparent_65%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.22),_transparent_70%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-36 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.12),_transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,_rgba(190,18,60,0.18),_transparent_70%)]"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-4 py-20 text-center sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
                        <Image
                            src="/Reheln.png"
                            alt="MapleStory Finder"
                            width={112}
                            height={112}
                            className="relative z-10 h-24 w-24 rounded-3xl border border-border/60 bg-background/90 p-4 shadow-lg shadow-primary/20 backdrop-blur"
                        />
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1 text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
                        404 Not Found
                    </span>
                    <div className="space-y-4 sm:space-y-5">
                        <h1 className="text-pretty text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            찾으시던 페이지를 발견하지 못했어요
                        </h1>
                        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                            입력하신 주소가 잘못되었거나 페이지가 이동되었을 수 있어요. 아래의 추천 경로로 이동하거나 검색을 이용해 원하시는 정보를 다시 찾아보세요.
                        </p>
                    </div>
                </div>

                <div className="grid w-full gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
                    {SUGGESTIONS.map(({ title, description, href, cta, Icon }) => (
                        <Card key={title} className="border-border/60 bg-background/80 backdrop-blur">
                            <CardHeader className="gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/60">
                                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                                    </span>
                                    <CardTitle className="text-base font-semibold text-foreground">
                                        {title}
                                    </CardTitle>
                                </div>
                                <CardDescription className="leading-relaxed text-sm text-muted-foreground">
                                    {description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="gap-2 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary"
                                >
                                    <Link href={href}>
                                        {cta}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            메인으로 돌아가기
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/search">
                            <Search className="h-4 w-4" />
                            캐릭터 검색하기
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
