export const translations = {
    en: {
        common: {
            appName: "MapleStory Finder",
            languageToggle: {
                ariaLabel: "Toggle language",
                short: {
                    en: "EN",
                    ko: "KO",
                },
                english: "EN",
                korean: "KO",
            },
            darkModeToggle: {
                ariaLabel: "Toggle dark mode",
            },
            loading: "Loading...",
            level: "Lv. {value}",
            info: "Info",
            detail: "Detail",
            search: "Search",
            or: "OR",
            home: "Home",
            backToHome: "Back to main",
            characterSearch: "Character Search",
            findCharacter: "Search characters",
            guest: "Guest",
        },
        search: {
            heading: "Search",
            description: "Find the character you want and explore their details.",
            placeholder: "Search for a character name",
            errors: {
                empty: "Please enter a character name.",
                notFound: "Character not found. Please check the name.",
            },
            loading: "Searching...",
            button: "Search",
        },
        auth: {
            signIn: {
                title: "Sign In",
                emailLabel: "Email",
                passwordLabel: "Password",
                submit: "Sign In",
                submitting: "Signing in...",
                google: {
                    start: "Continue with Google",
                    loading: "Signing in with Google...",
                },
                kakao: {
                    start: "Continue with Kakao",
                    loading: "Signing in with Kakao...",
                },
                guest: {
                    start: "Browse as guest",
                    loading: "Entering as guest...",
                },
                noAccount: "Don't have an account?",
                signUpCta: "Sign up",
                toast: {
                    success: "Signed in successfully.",
                    guestSuccess: "Signed in as guest.",
                    googleError: "There was a problem with Google sign-in.",
                    kakaoError: "There was a problem with Kakao sign-in.",
                },
            },
            signUp: {
                title: "Sign Up",
                emailLabel: "Email",
                passwordLabel: "Password",
                apiKeyLabel: "Nexon API Key",
                submit: "Create account",
                submitting: "Creating account...",
                alreadyHave: "Already have an account?",
                signInCta: "Sign in",
                toast: {
                    verificationSent: "A verification email has been sent to {email}. Please check your inbox.",
                },
            },
        },
        landing: {
            hero: {
                title: "Finder shows your characters at a glance",
                description:
                    "From real-time character search to stat summaries, the AI chatbot, and figure generation, explore every feature of MapleStory Finder in one clean layout.",
                ctaPrimary: "Get started now",
                ctaSecondary: "Search characters",
            },
            preview: {
                title: "Finder preview",
                description: "Search for your character in Finder.",
                cards: {
                    character: {
                        label: "Character",
                        title: "Real-time search",
                        description:
                            "Check basic information and stats instantly by entering only the nickname and world.",
                    },
                    insight: {
                        label: "Insights",
                        title: "AI assistant",
                        description:
                            "Ask the AI about combat power, gear loadouts, and anything else you're curious about.",
                    },
                },
            },
            highlights: {
                search: {
                    title: "Real-time character search",
                    description:
                        "Quickly find the character you want and review key information with just a nickname and world.",
                },
                stats: {
                    title: "Stat report at a glance",
                    description:
                        "Attack, boss damage, critical rate, and other core stats are organized automatically.",
                },
                equipment: {
                    title: "Gear and item check",
                    description:
                        "Review equipped gear and major options in tidy, card-based layouts.",
                },
            },
            quickLinks: {
                chat: {
                    title: "Gemini AI chatbot",
                    description:
                        "Use the conversational interface powered by MapleStory data to get answers to your questions.",
                    cta: "Open chatbot",
                },
                figure: {
                    title: "Character figure generator",
                    description:
                        "Let AI render a 3D figure based on your character image. Jump in directly from the character detail page.",
                    cta: "Go to figure page",
                },
            },
        },
        notFound: {
            title: "We couldn't find the page you were looking for",
            description:
                "The address you entered may be incorrect or the page may have moved. Try one of the recommended paths below or use search to find what you need.",
            suggestions: {
                landing: {
                    title: "Go to the landing page",
                    description: "Check the main features and updates introduced on the Finder overview page.",
                    cta: "Browse the main page",
                },
                search: {
                    title: "Character search",
                    description: "Enter the world and nickname to view character information in real time.",
                    cta: "Search now",
                },
                favorites: {
                    title: "Manage favorites",
                    description: "After signing in, save frequently viewed characters and manage them in one place.",
                    cta: "Go to favorites",
                },
            },
            actions: {
                home: "Back to main",
                search: "Search for characters",
            },
        },
        home: {
            characterInfo: {
                emptyState: "Please choose your character",
                detailButton: "Detail",
            },
            dialog: {
                title: "Info",
            },
        },
        authProvider: {
            toast: {
                logout: "You have been logged out.",
                loginRequired: "Please sign in to use this service.",
            },
        },
        character: {
            detail: {
                tabs: {
                    basic: "Basic",
                    union: "Union",
                    equip: "Equipment",
                    skill: "Skills",
                    cash: "Cash",
                    etc: "Other",
                },
                toast: {
                    loadCharacter: "Failed to load character information.",
                    loadUnion: "Failed to load union information.",
                    loadEquip: "Failed to load equipment information.",
                    loadSkill: "Failed to load skill information.",
                    loadCash: "Failed to load cash information.",
                    loadEtc: "Failed to load additional information.",
                },
            },
            banner: {
                union: "Union Lv. {level}",
                dojang: "Mu Lung {floor}F",
                popularity: "Fame {value}",
                guild: "Guild {name}",
                figure: "Figure",
                figureTooltip: "This feature is still under development.",
            },
        },
    },
    ko: {
        common: {
            appName: "MapleStory Finder",
            languageToggle: {
                ariaLabel: "언어 전환",
                short: {
                    en: "EN",
                    ko: "KO",
                },
                english: "영어",
                korean: "한국어",
            },
            darkModeToggle: {
                ariaLabel: "다크 모드 전환",
            },
            loading: "로딩 중...",
            level: "Lv. {value}",
            info: "정보",
            detail: "상세",
            search: "검색",
            or: "또는",
            home: "홈",
            backToHome: "메인으로 돌아가기",
            characterSearch: "캐릭터 검색",
            findCharacter: "캐릭터를 검색",
            guest: "게스트",
        },
        search: {
            heading: "검색",
            description: "원하는 캐릭터를 찾아 상세 정보를 확인할 수 있습니다.",
            placeholder: "캐릭터 이름을 검색하세요",
            errors: {
                empty: "캐릭터 이름을 입력해주세요.",
                notFound: "캐릭터를 찾을 수 없습니다. 이름을 확인해주세요.",
            },
            loading: "검색 중...",
            button: "검색",
        },
        auth: {
            signIn: {
                title: "로그인",
                emailLabel: "이메일",
                passwordLabel: "비밀번호",
                submit: "로그인",
                submitting: "로그인 중...",
                google: {
                    start: "구글 로그인",
                    loading: "구글 로그인 중...",
                },
                kakao: {
                    start: "카카오 로그인",
                    loading: "카카오 로그인 중...",
                },
                guest: {
                    start: "게스트로 둘러보기",
                    loading: "게스트로 입장 중...",
                },
                noAccount: "아직 계정이 없으신가요?",
                signUpCta: "회원가입",
                toast: {
                    success: "로그인에 성공했습니다.",
                    guestSuccess: "게스트로 입장했습니다.",
                    googleError: "구글 로그인 중 문제가 발생했습니다.",
                    kakaoError: "카카오 로그인 중 문제가 발생했습니다.",
                },
            },
            signUp: {
                title: "회원가입",
                emailLabel: "이메일",
                passwordLabel: "비밀번호",
                apiKeyLabel: "넥슨 API 키",
                submit: "계정 생성",
                submitting: "계정 생성 중...",
                alreadyHave: "이미 계정이 있으신가요?",
                signInCta: "로그인",
                toast: {
                    verificationSent: "{email}로 인증 메일이 발송되었습니다. 확인해 주세요.",
                },
            },
        },
        landing: {
            hero: {
                title: "내 캐릭터를 한눈에 정리해 보여주는 『Finder』",
                description:
                    "실시간 캐릭터 검색부터 스탯 요약, AI 챗봇, 피규어 생성까지 MapleStory Finder에서 모두 이용해 보세요. 다른 페이지와 어우러지는 깔끔한 레이아웃으로 주요 기능을 빠르게 확인할 수 있습니다.",
                ctaPrimary: "지금 시작하기",
                ctaSecondary: "캐릭터 검색",
            },
            preview: {
                title: "Finder 미리보기",
                description: "Finder에서 내 캐릭터를 검색해보세요.",
                cards: {
                    character: {
                        label: "캐릭터",
                        title: "실시간 검색",
                        description: "닉네임과 월드만 입력하면 기본 정보와 스탯을 즉시 확인할 수 있습니다.",
                    },
                    insight: {
                        label: "인사이트",
                        title: "AI 도우미",
                        description: "AI가 전투력, 장비 구성 등 궁금한 내용을 대화로 안내합니다.",
                    },
                },
            },
            highlights: {
                search: {
                    title: "실시간 캐릭터 검색",
                    description: "닉네임과 월드만 입력하면 원하는 캐릭터를 빠르게 찾아 주요 정보를 확인할 수 있습니다.",
                },
                stats: {
                    title: "한눈에 보는 스탯 리포트",
                    description: "공격력, 보스 대미지, 크리티컬 등 핵심 스탯을 자동으로 정리해 제공합니다.",
                },
                equipment: {
                    title: "장비와 아이템 체크",
                    description: "현재 착용 중인 장비와 주요 옵션을 깔끔한 카드 형식으로 살펴볼 수 있습니다.",
                },
            },
            quickLinks: {
                chat: {
                    title: "Gemini AI 챗봇",
                    description:
                        "메이플스토리 데이터를 기반으로 질문에 답하는 대화형 인터페이스를 사용해 보세요.",
                    cta: "챗봇 열기",
                },
                figure: {
                    title: "캐릭터 피규어 생성",
                    description:
                        "AI가 캐릭터 이미지를 바탕으로 3D 피규어 렌더를 생성해 드립니다. 캐릭터 상세에서 바로 이동하세요.",
                    cta: "피규어 페이지로",
                },
            },
        },
        notFound: {
            title: "찾으시던 페이지를 발견하지 못했어요",
            description:
                "입력하신 주소가 잘못되었거나 페이지가 이동되었을 수 있어요. 아래의 추천 경로로 이동하거나 검색을 이용해 원하시는 정보를 다시 찾아보세요.",
            suggestions: {
                landing: {
                    title: "랜딩으로 이동",
                    description: "Finder 소개 페이지에서 제공하는 주요 기능과 소식을 확인해 보세요.",
                    cta: "메인 살펴보기",
                },
                search: {
                    title: "캐릭터 검색",
                    description: "월드와 닉네임만 입력하면 실시간으로 캐릭터 정보를 확인할 수 있어요.",
                    cta: "바로 검색하기",
                },
                favorites: {
                    title: "즐겨찾기 관리",
                    description: "로그인 후 자주 보는 캐릭터를 저장하고 한곳에서 관리해 보세요.",
                    cta: "즐겨찾기 이동",
                },
            },
            actions: {
                home: "메인으로 돌아가기",
                search: "캐릭터 검색하기",
            },
        },
        home: {
            characterInfo: {
                emptyState: "캐릭터를 선택해주세요",
                detailButton: "상세 보기",
            },
            dialog: {
                title: "정보",
            },
        },
        authProvider: {
            toast: {
                logout: "로그아웃되었습니다.",
                loginRequired: "로그인이 필요한 서비스입니다.",
            },
        },
        character: {
            detail: {
                tabs: {
                    basic: "기본 정보",
                    union: "유니온",
                    equip: "장비",
                    skill: "스킬",
                    cash: "캐시",
                    etc: "기타",
                },
                toast: {
                    loadCharacter: "캐릭터 정보 로딩 실패",
                    loadUnion: "유니온 정보 로딩 실패",
                    loadEquip: "장비 정보 로딩 실패",
                    loadSkill: "스킬 정보 로딩 실패",
                    loadCash: "캐시 정보 로딩 실패",
                    loadEtc: "기타 정보 로딩 실패",
                },
            },
            banner: {
                union: "유니온 {level}",
                dojang: "무릉 {floor}층",
                popularity: "인기도 {value}",
                guild: "길드 {name}",
                figure: "피규어",
                figureTooltip: "아직 미완성 기능입니다",
            },
        },
    },
} as const;

export type Language = keyof typeof translations;

export type NestedKeyOf<ObjectType extends Record<string, unknown>> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Record<string, unknown>
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<(typeof translations)[Language]>;

export const translate = (
    language: Language,
    key: TranslationKey,
    params?: Record<string, string | number>,
): string => {
    const parts = key.split(".");
    let value: unknown = translations[language];

    for (const part of parts) {
        if (value && typeof value === "object" && part in (value as Record<string, unknown>)) {
            value = (value as Record<string, unknown>)[part];
        } else {
            value = undefined;
            break;
        }
    }

    if (typeof value !== "string") {
        // fallback to english if missing
        if (language !== "en") {
            return translate("en", key, params);
        }
        return key;
    }

    if (!params) {
        return value;
    }

    return value.replace(/\{(\w+)\}/g, (_, param) => String(params[param] ?? ""));
};
