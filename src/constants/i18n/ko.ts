export const ko = {
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
        maintenanceDialog: {
            title: "점검 안내",
            description: "현재 메이플스토리 API가 점검 중입니다. 잠시 후 다시 시도해 주세요.",
            confirm: "확인",
        },
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
    offline: {
        title: "오프라인 상태입니다",
        description:
            "인터넷 연결을 확인한 뒤 다시 시도해주세요. 최근에 방문한 페이지는 일부 오프라인에서도 사용할 수 있어요.",
        actions: {
            retry: "다시 시도",
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
} as const;
