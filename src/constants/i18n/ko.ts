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
            common: {
                preset: "프리셋 {number}",
            },
            sections: {
                ability: {
                    title: "어빌리티",
                },
                android: {
                    title: "안드로이드",
                    grade: "{grade}등급",
                },
                beauty: {
                    title: "외형",
                    hair: "헤어",
                    face: "얼굴",
                    skin: "피부",
                },
                cash: {
                    title: "캐시장비",
                },
                dojang: {
                    title: "무릉도장",
                    bestFloor: "최고 층수: {floor}층",
                    bestTime: "기록: {time}초",
                },
                hexaMatrix: {
                    title: "헥사 매트릭스",
                },
                hexaStat: {
                    title: "헥사 스탯",
                },
                hyperStat: {
                    title: "하이퍼 스탯",
                    availablePoints: "사용 가능 포인트: {value}",
                },
                linkSkill: {
                    title: "링크 스킬",
                },
                otherStat: {
                    title: "기타 스탯",
                    empty: "정보가 없습니다.",
                },
                pet: {
                    title: "펫",
                },
                propensity: {
                    title: "성향",
                    labels: {
                        charisma: "카리스마",
                        empathy: "감성",
                        insight: "통찰",
                        willpower: "의지",
                        diligence: "손재주",
                        charm: "매력",
                    },
                },
                ring: {
                    title: "스페셜 링",
                },
                setEffect: {
                    title: "세트 효과",
                    entry: "{count}세트: {option}",
                },
                skill: {
                    title: "스킬",
                },
                symbol: {
                    title: "심볼",
                },
                union: {
                    title: "유니온",
                    level: "레벨",
                    grade: "등급",
                    artifactLevel: "아티팩트 레벨",
                    raiderEffects: "공격대원 효과",
                    artifactEffects: "아티팩트 효과",
                },
                vMatrix: {
                    title: "V 매트릭스",
                },
            },
            stat: {
                battlePower: "전투력",
                labels: {
                    statAttack: "스탯공격력",
                    attackPower: "공격력",
                    magicAttack: "마력",
                    damage: "데미지",
                    finalDamage: "최종 데미지",
                    bossDamage: "보스 몬스터 데미지",
                    normalDamage: "일반 몬스터 데미지",
                    ignoreDefense: "방어율 무시",
                    critRate: "크리티컬 확률",
                    critDamage: "크리티컬 데미지",
                    cooldownReductionSeconds: "재사용 대기시간 감소 (초)",
                    cooldownReductionPercent: "재사용 대기시간 감소 (%)",
                    cooldownIgnore: "재사용 대기시간 미적용",
                    statusDamage: "상태이상 추가 데미지",
                    buffDuration: "버프 지속시간",
                    attackSpeed: "공격 속도",
                    weaponMastery: "무기 숙련도",
                    mesoObtained: "메소 획득량",
                    itemDropRate: "아이템 드롭률",
                    bonusExp: "추가 경험치 획득",
                    starForce: "스타포스",
                    arcaneForce: "아케인포스",
                    authenticForce: "어센틱포스",
                    speed: "이동속도",
                    jump: "점프력",
                    statusResistance: "상태이상 내성",
                    stance: "스탠스",
                },
            },
        },
        banner: {
            union: "유니온 {level}",
            dojang: "무릉 {floor}층",
            ranking: "종합 랭킹 {value}위",
            guild: "길드 {name}",
            figure: "피규어",
            figureTooltip: "아직 미완성 기능입니다",
            starforce: "스타포스",
            cube: "큐브",
        },
        ranking: {
            title: "랭킹",
            overall: "종합",
            union: "유니온",
            dojang: "무릉도장",
            theseed: "더 시드",
            achievement: "업적",
            level: "레벨 {level}",
            unionDetail: "레벨 {level} · 파워 {power}",
            floor: "{floor}층",
            record: "기록 {time}",
            achievementDetail: "등급 {grade} · 점수 {score}",
            updated: "{date} 기준",
            empty: "랭킹 정보가 없습니다.",
        },
        item: {
            equipment: {
                title: "장비",
                mainOptions: {
                    allStat: "올스탯",
                    maxHp: "최대 HP",
                    maxMp: "최대 MP",
                    attackPower: "공격력",
                    magicPower: "마력",
                    armor: "방어력",
                },
                potential: {
                    label: "잠재옵션",
                    gradeLabel: "({grade} 아이템)",
                },
                additionalPotential: {
                    label: "에디셔널 잠재옵션",
                },
            },
        },
    },
    history: {
        common: {
            error: "확률 정보를 불러오는 중 문제가 발생했습니다.",
            countError: "결과 개수는 10 이상 1000 이하의 정수만 입력할 수 있습니다.",
            initial: "조회할 날짜와 개수를 입력해 주세요.",
            empty: "조회된 결과가 없습니다.",
            form: {
                date: "조회 기준일",
                count: "조회 개수",
                countHint: "최소 10, 최대 1000개의 결과를 한 번에 조회할 수 있습니다.",
                submit: "조회하기",
                loading: "조회 중...",
                loadMore: "더 불러오기",
                result: "현재 {count}건의 결과를 보고 있습니다.",
            },
        },
        starforce: {
            title: "스타포스 강화 이력",
            description: "날짜별로 공개된 스타포스 강화 결과를 조회할 수 있습니다. 데이터는 최대 2년간 제공됩니다.",
            labels: {
                stars: "{before}성 → {after}성",
                scroll: "사용 주문서",
            },
            flags: {
                superior: "슈페리얼 장비",
                starcatch: "스타캐치",
                destroyDefence: "파괴 방지",
                chanceTime: "찬스 타임",
                eventField: "이벤트 필드",
                protectShield: "프로텍트 실드",
                bonusStat: "보너스 스탯 부여",
            },
            event: {
                success: "성공 확률",
                destroy: "파괴 확률 감소",
                discount: "비용 할인",
                plus: "추가 강화 수치",
            },
        },
        cube: {
            title: "큐브 사용 이력",
            description: "날짜별 큐브 사용 결과와 잠재옵션 변화를 확인할 수 있습니다. 데이터는 최대 2년간 제공됩니다.",
            flags: {
                miracleTime: "미라클 타임",
                guaranteed: "확정 등급 상승",
                stacks: "누적 스택 {count}개",
            },
            labels: {
                part: "장비 분류: {part}",
                level: "아이템 레벨 {level}",
                potential: "잠재능력 {grade}",
                additionalPotential: "에디셔널 잠재능력 {grade}",
                beforePotential: "변경 전 잠재능력",
                afterPotential: "변경 후 잠재능력",
                beforeAdditional: "변경 전 에디셔널",
                afterAdditional: "변경 후 에디셔널",
            },
            emptyOption: "옵션 정보가 제공되지 않았습니다.",
        },
    },
} as const;
