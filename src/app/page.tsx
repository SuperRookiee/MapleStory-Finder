import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import { ArrowRight, BarChart3, Bot, type LucideIcon, Search, ShieldCheck, Sparkles, Wand2, } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
    return (
        <ViewTransition enter="fade" exit="fade">
            <DarkModeToggle className='absolute top-1 right-1 z-10'/>
            <main className="bg-background text-foreground">
                <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-4 pb-16 pt-12 sm:px-6 lg:px-8 space-y-6">
                    <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
                        <div className="space-y-6">
                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.32em] text-muted-foreground">
                                <Image
                                    src="/Reheln.png"
                                    alt="MapleStory Finder"
                                    className="object-contain"
                                    width={20}
                                    height={20}
                                    priority
                                />
                                MapleStory Finder
                            </div>
                            <h1 className="text-balance text-4xl font-semibold leading-tight break-keep tracking-tight sm:text-5xl">
                                내 캐릭터를 한눈에 정리해 보여주는 『Finder』
                            </h1>
                            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg mb-10">
                                실시간 캐릭터 검색부터 스탯 요약, AI 챗봇, 피규어 생성까지 MapleStory Finder에서 모두 이용해 보세요. 다른 페이지와 어우러지는 깔끔한 레이아웃으로 주요 기능을 빠르게 확인할 수 있습니다.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild className="gap-2">
                                    <Link href="/sign_in">
                                        지금 시작하기
                                        <ArrowRight className="h-4 w-4"/>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="gap-2">
                                    <Link href="/search">
                                        캐릭터 검색
                                        <Search className="h-4 w-4"/>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        {/* 미리보기 */}
                        <Card className="h-full border-border/70 bg-card/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex gap-2 items-baseline">
                                    <Sparkles className="h-4 w-4 text-primary mb-0.5"/> Finder 미리보기
                                </CardTitle>
                                <CardDescription>
                                    Finder에서 내 캐릭터를 검색해보세요.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6 pb-8">
                                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl bg-muted sm:w-56">
                                    <Image
                                        src="/images/preview/character_detail.png"
                                        alt="MapleStory Finder"
                                        fill
                                        className="object-contain px-2 block dark:hidden"
                                        sizes="(max-width: 768px) 10rem, 14rem"
                                        priority
                                    />
                                    <Image
                                        src="/images/preview/character_detail_dark.png"
                                        alt="MapleStory Finder"
                                        fill
                                        className="object-contain px-2 hidden dark:block"
                                        sizes="(max-width: 768px) 10rem, 14rem"
                                        priority
                                    />
                                </div>
                                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                                    <div
                                        className="rounded-lg border border-dashed border-border/70 bg-background/70 p-4
                                            transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">캐릭터</p>
                                        <p className="mt-1 text-base font-semibold text-foreground">실시간 검색</p>
                                        <p className="mt-1 text-xs text-muted-foreground">닉네임과 월드만 입력하면 기본 정보와 스탯을 즉시 확인할 수 있습니다.</p>
                                    </div>
                                    <div
                                        className="rounded-lg border border-dashed border-border/70 bg-background/70 p-4
                                            transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">인사이트</p>
                                        <p className="mt-1 text-base font-semibold text-foreground">AI 도우미</p>
                                        <p className="mt-1 text-xs text-muted-foreground">AI가 전투력, 장비 구성 등 궁금한 내용을 대화로 안내합니다.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {HIGHLIGHTS.map(({ Icon, title, description }) => (
                            <Card
                                key={title}
                                className="border-border/70 transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20"
                            >
                                <CardContent className="flex flex-col gap-4 py-6">
                                    <Icon className="h-10 w-10 text-primary" strokeWidth={1.6}/>
                                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                                    <p className="text-sm text-muted-foreground">{description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {QUICK_LINKS.map(({ title, description, href, cta, Icon }) => (
                            <Card key={title} className="border-border/70 bg-muted/40">
                                <CardContent className="flex h-full flex-col gap-4 py-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{title}</p>
                                            <p className="text-sm text-muted-foreground">{description}</p>
                                        </div>
                                        <Icon className="h-5 w-5 text-primary" strokeWidth={1.6}/>
                                    </div>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-fit gap-2 px-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary"
                                    >
                                        <Link href={href}>
                                            {cta}
                                            <ArrowRight className="h-4 w-4"/>
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                </div>
            </main>
        </ViewTransition>
    );
};

type Feature = {
    title: string;
    description: string;
    Icon: LucideIcon;
};

type QuickLink = {
    title: string;
    description: string;
    href: string;
    cta: string;
    Icon: LucideIcon;
};

const HIGHLIGHTS: Feature[] = [
    {
        title: "실시간 캐릭터 검색",
        description: "닉네임과 월드만 입력하면 원하는 캐릭터를 빠르게 찾아 주요 정보를 확인할 수 있습니다.",
        Icon: Search,
    },
    {
        title: "한눈에 보는 스탯 리포트",
        description: "공격력, 보스 대미지, 크리티컬 등 핵심 스탯을 자동으로 정리해 제공합니다.",
        Icon: BarChart3,
    },
    {
        title: "장비와 아이템 체크",
        description: "현재 착용 중인 장비와 주요 옵션을 깔끔한 카드 형식으로 살펴볼 수 있습니다.",
        Icon: ShieldCheck,
    },
];

const QUICK_LINKS: QuickLink[] = [
    {
        title: "Gemini AI 챗봇",
        description: "메이플스토리 데이터를 기반으로 질문에 답하는 대화형 인터페이스를 사용해 보세요.",
        href: "/chat",
        cta: "챗봇 열기",
        Icon: Bot,
    },
    {
        title: "캐릭터 피규어 생성",
        description: "AI가 캐릭터 이미지를 바탕으로 3D 피규어 렌더를 생성해 드립니다. 캐릭터 상세에서 바로 이동하세요.",
        href: "/figure",
        cta: "피규어 페이지로",
        Icon: Wand2,
    },
];

export default Page;
