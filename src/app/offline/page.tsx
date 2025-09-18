import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "오프라인 | Finder",
    description: "인터넷 연결이 없어도 최근에 방문한 페이지를 사용할 수 있습니다.",
};

const OfflinePage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="space-y-3">
                <h1 className="text-3xl font-bold sm:text-4xl">오프라인 상태입니다</h1>
                <p className="text-muted-foreground">
                    인터넷 연결을 확인한 후 다시 시도해주세요. 최근에 방문한 페이지는 일부 오프라인에서도 사용할 수 있습니다.
                </p>
            </div>
            <Link
                href="/"
                className="rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70"
            >
                홈으로 돌아가기
            </Link>
        </main>
    );
};

export default OfflinePage;
