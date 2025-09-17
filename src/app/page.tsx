import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Search, ShieldCheck, Sparkles, } from "lucide-react";

// DashBoard
const Page = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                <div className="absolute -top-48 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/30 via-fuchsia-500/25 to-emerald-400/30 blur-3xl" />
                <div className="absolute bottom-[-12rem] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-purple-500/20 via-sky-400/25 to-pink-500/20 blur-[140px]" />
            </div>
            <div className="relative z-10">
                <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-8 lg:px-12">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur">
                        <Image src="/Reheln.png" alt="Finder" width={24} height={24} priority />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-100/80">
                            MapleStory Finder
                        </span>
                    </div>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-slate-900/60"
                    >
                        실시간 검색 둘러보기
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                </header>
                <section className="px-6 pb-20 pt-6 sm:px-8 sm:pt-10 lg:px-12">
                    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-100/80 backdrop-blur">
                            <Sparkles className="h-4 w-4 text-sky-300" />
                            Next-Gen Maple Data
                        </span>
                        <h1 className="mt-8 text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            <p className="bg-gradient-to-r from-sky-200 via-fuchsia-300 to-emerald-200 bg-clip-text text-transparent">
                                내 캐릭터 정보를 한눈에 확인하는 순간
                            </p>
                            <p>MapleStory Finder</p>
                        </h1>
                        <p className="mt-6 max-w-3xl text-balance text-lg text-slate-300 sm:text-xl">
                            메이플스토리 캐릭터를 검색하고 주요 스탯과 착용 아이템을 손쉽게 확인하세요.
                            필요한 정보만 깔끔하게 정리해 드립니다.
                        </p>
                        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                            <Link
                                href="/sign_in"
                                className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_45px_-20px_rgba(56,189,248,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_65px_-25px_rgba(14,165,233,0.9)]"
                            >
                                지금 시작하기
                                <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/search"
                                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/[0.08] px-8 py-3 text-base font-semibold text-slate-100 backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300/60 hover:bg-slate-900/60"
                            >
                                캐릭터 검색 둘러보기
                            </Link>
                        </div>
                    </div>
                    <div className="mx-auto mt-20 grid max-w-5xl gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
                        {HIGHLIGHTS.map(({ Icon, title, description }) => (
                            <div
                                key={title}
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur"
                            >
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 blur-2xl" />
                                <Icon className="h-10 w-10 text-sky-300" strokeWidth={1.6} />
                                <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                                <p className="mt-3 text-sm text-slate-300">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

const HIGHLIGHTS = [
    {
        title: "실시간 캐릭터 검색",
        description:
            "닉네임과 월드만 입력하면 원하는 캐릭터를 빠르게 찾아볼 수 있습니다.",
        Icon: Search,
    },
    {
        title: "한눈에 보는 스탯 리포트",
        description:
            "공격력, 보스 대미지, 크리티컬 등 핵심 스탯을 자동으로 정리해 보여드립니다.",
        Icon: BarChart3,
    },
    {
        title: "장비와 아이템 체크",
        description:
            "현재 착용 중인 장비와 주요 옵션을 상세하게 확인할 수 있습니다.",
        Icon: ShieldCheck,
    },
];

export default Page;
