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
        cancel: "취소",
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
    todoList: {
        navigation: {
            overview: "보스 To Do 리스트",
            dashboard: "대시보드",
        },
        hero: {
            badge: "Finder 보스 플래너",
            title: "주간·월간 보스를 한곳에서 정리하세요",
            description:
                "파티 일정부터 주간 보스 진행도, 메모까지 한 페이지에서 빠르게 확인하고 관리할 수 있습니다.",
            resetInfo: "모든 콘텐츠는 매주 목요일 00시(KST)에 초기화돼요.",
        },
        calendar: {
            title: "일정 관리 캘린더",
            description: "함께 보스를 도는 친구들과 일정을 공유하고 약속을 관리해 보세요.",
            friendBadge: "파티 일정 공유",
            currentMonth: "이번 달",
            today: "오늘",
            selectedDate: "선택한 날짜",
            selectedDescription: "선택한 날짜에 예정된 약속을 확인하고 새 일정을 추가할 수 있어요.",
            empty: "아직 등록된 일정이 없어요.",
            remove: "삭제",
            edit: "수정",
            addEvent: "일정 추가",
            dialog: {
                title: "일정 등록",
                editTitle: "일정 수정",
                titleLabel: "제목",
                titlePlaceholder: "예: 저녁 루시드 파티",
                friendLabel: "함께할 파티원",
                friendPlaceholder: "쉼표(,) 또는 줄바꿈으로 친구 이름을 구분해주세요.",
                friendHelp: "예) 나로, 데몬어벤, 히어로",
                memoLabel: "메모",
                memoPlaceholder: "필요한 준비물이나 역할을 기록해 두세요.",
                dateLabel: "날짜",
                dateHelp: "선택한 달 안에서만 날짜를 조정할 수 있어요.",
                saving: "저장 중...",
                editSaving: "수정 중...",
                save: "저장",
                update: "변경 사항 저장",
            },
        },
        memos: {
            title: "일정 메모",
            description: "주간 목표나 준비물을 체크리스트 형태로 정리해 보세요.",
            weeklyReset: "매주 목요일 초기화",
            addLabel: "이번 주 메모",
            placeholder: "남겨둘 메모를 입력하세요.",
            saving: "추가 중...",
            addButton: "메모 추가",
            empty: "등록된 메모가 없어요.",
            completedLabel: "완료",
            todoLabel: "진행 중",
            dueDateLabel: "{date}까지",
            noDueDate: "날짜 미지정",
            edit: {
                title: "메모 수정",
                description: "메모 내용을 편집하고 필요한 날짜를 설정하세요.",
                textLabel: "메모 내용",
                dateLabel: "날짜",
                clearDate: "날짜 지우기",
                saving: "수정 중...",
                save: "변경 사항 저장",
            },
        },
        bosses: {
            title: "보스 체크리스트",
            description: "데일리, 주간, 월간 보스 진행 상황을 한 곳에서 관리하세요.",
            resetInfo: "데일리는 매일, 주간은 목요일 00시, 월간은 매월 1일에 초기화돼요.",
            summary: {
                clears: "이번 주 클리어",
                clearsHint: "주간 보스로 기록된 클리어 수",
                reward: "예상 수익",
                rewardHint: "기본 메소 보상을 기준으로 계산돼요.",
                worldReward: "{world} 총 수익",
                worldRewardHint: "선택한 월드에 속한 모든 캐릭터의 합계",
            },
            selectors: {
                world: {
                    label: "월드 선택",
                    placeholder: "월드를 선택하세요",
                    unassigned: "미지정 월드",
                },
                character: {
                    label: "캐릭터 선택",
                    placeholder: "캐릭터를 선택하세요",
                    unassigned: "미지정 캐릭터",
                },
            },
            characterEarnings: {
                title: "캐릭터별 수익",
                description: "{world}에서 진행한 기록",
                totalLabel: "합계 {value}",
                empty: "아직 기록된 캐릭터가 없어요.",
                clears: "총 {count}회 클리어",
                helper: "Lv.{level} · {job}",
                openDialog: "자세히 보기",
                dialogTitle: "캐릭터 수익 상세",
                dialogDescription: "{world} 월드의 캐릭터별 클리어 현황과 예상 수익을 확인하세요.",
                characterCount: "총 {count}명",
            },
            groupBadge: "총 {count}개",
            rewardLabel: "보상: {value}",
            status: {
                done: "완료",
                todo: "예정",
            },
            difficulties: {
                easy: "이지",
                normal: "노멀",
                hard: "하드",
                chaos: "카오스",
                extreme: "익스트림",
            },
            frequency: {
                daily: "데일리",
                weekly: "주간",
                monthly: "월간",
            },
            groups: {
                "daily-bosses": {
                    title: "데일리 보스",
                    description: "매일 초기화되는 보스 진행도를 확인하세요.",
                },
                "weekly-bosses": {
                    title: "주간 보스",
                    description: "주간 초기화 대상 보스를 한 번에 관리할 수 있어요.",
                },
                "monthly-bosses": {
                    title: "월간 보스",
                    description: "월 1회 도전 가능한 보스 기록입니다.",
                },
            },
        },
        toast: {
            error: "데이터를 불러오거나 저장하는 중 문제가 발생했습니다.",
            memoAdded: "새 메모를 추가했어요.",
            memoUpdated: "메모를 수정했어요.",
            memoRemoved: "메모를 삭제했어요.",
            eventAdded: "일정을 등록했습니다.",
            eventUpdated: "일정을 수정했어요.",
            eventRemoved: "일정을 삭제했습니다.",
            weeklyWorldLimit: "월드당 주간 보스는 최대 {limit}개까지만 등록할 수 있어요.",
            weeklyCharacterLimit: "한 캐릭터는 주간 보스를 최대 {limit}개까지만 완료할 수 있어요.",
        },
        dashboard: {
            cards: {
                weeklyClears: {
                    title: "이번 주 클리어",
                    description: "주간 보스 완료 횟수",
                    subtitle: "총 {total}회 진행 가능",
                },
                reward: {
                    title: "예상 수익",
                    description: "이번 주 누적 메소",
                    subtitle: "보스 기본 보상을 기준으로 계산돼요.",
                },
                progress: {
                    title: "완료율",
                    description: "주간 보스 진행률",
                    subtitle: "목표 대비 진행 상황",
                },
                monthly: {
                    title: "최근 월간 클리어",
                    description: "최근 월간 보스 진행 현황",
                    subtitle: "총 {value}개월 기록",
                },
            },
            weeklyTrend: {
                title: "주간 진행 추세",
                description: "최근 12주 동안의 클리어 수와 예상 보상을 비교해 보세요.",
                badge: "최근 12주",
                rewardLabel: "예상 수익",
                clearLabel: "클리어 수",
                clears: "클리어",
                reward: "보상(억 메소)",
            },
            groupStats: {
                title: "빈도별 현황",
                description: "빈도별 보스 클리어 현황과 예상 수익입니다.",
                subtitle: "{cleared}/{total} 완료",
                reward: "예상 수익",
            },
            monthly: {
                title: "월간 진행 기록",
                description: "최근 6개월 동안의 월간 보스 진행 현황입니다.",
                barLabel: "월간 보스 클리어 수",
                tooltipLabel: "월간 클리어",
                tooltipValue: "{total}개 중 {value}개 완료",
                summary: "최근 기록에서 월간 보스를 총 {value, plural, one {한 번} other {#번}} 완료했어요. (현재 {total}종)",
            },
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
        hero: {
            badge: "즐겨찾기 대시보드",
            title: "즐겨찾는 캐릭터를 한눈에",
            description: "자주 확인하는 캐릭터를 등록하고 장비 정보를 빠르게 확인하세요.",
        },
        stats: {
            totalFavorites: "등록된 즐겨찾기",
            totalFavoritesHelper: "즐겨찾기에 {count}명의 캐릭터가 등록되어 있습니다.",
            totalFavoritesHelperEmpty: "즐겨찾기를 추가하면 여기에서 빠르게 확인할 수 있어요.",
            selected: "선택된 캐릭터",
            selectedHelper: "목록에서 캐릭터를 선택하면 장비 미리보기를 볼 수 있습니다.",
            level: "Lv. {level}",
            none: "—",
        },
        favorites: {
            title: "내 즐겨찾기",
            description: "목록에서 캐릭터를 선택해 장비 요약을 확인하세요.",
            empty: "즐겨찾기에 등록된 캐릭터가 없습니다.",
        },
        characterInfo: {
            emptyState: "캐릭터를 선택해주세요",
            detailButton: "상세 보기",
        },
        dialog: {
            title: "정보",
        },
    },
    characterList: {
        header: {
            badge: "캐릭터 현황",
            title: "보유 캐릭터 관리",
            description: "계정과 연동된 캐릭터를 필터링하고 한 번의 클릭으로 상세 페이지로 이동하세요.",
        },
        stats: {
            total: "연동된 캐릭터",
            filtered: "필터 적용 결과",
            favorites: "즐겨찾기",
            totalHelper: "계정과 연동된 캐릭터 수입니다.",
            filteredHelper: "{world} 기준으로 표시 중입니다.",
            favoritesHelper: "앱 전반에서 {count}명의 즐겨찾기를 사용할 수 있어요.",
        },
        filters: {
            title: "필터",
            description: "월드를 선택하거나 이름을 검색해 목록을 좁혀보세요.",
            world: {
                label: "월드",
                all: "전체 월드",
            },
            search: {
                label: "검색",
                placeholder: "캐릭터 이름을 검색하세요",
            },
        },
        list: {
            title: "캐릭터 목록",
            description: "카드를 선택하면 상세 정보를 확인할 수 있습니다.",
        },
        empty: {
            title: "조건에 맞는 캐릭터가 없습니다",
            description: "다른 월드를 선택하거나 계정 연동 상태를 다시 확인해 주세요.",
        },
    },
    notice: {
        title: "메이플스토리 공지 모음",
        description:
            "최근 공지사항, 업데이트 노트, 진행 중 이벤트, 캐시샵 소식을 한곳에서 확인하세요.",
        tabs: {
            notice: "공지사항",
            update: "업데이트",
            event: "이벤트",
            cashshop: "캐시샵",
        },
        table: {
            headers: {
                title: "제목",
                date: "등록일",
                period: "이벤트 기간",
                salePeriod: "판매 기간",
                status: "상태",
            },
            empty: "등록된 게시글이 없습니다.",
            noData: "—",
        },
        status: {
            ongoing: "진행 중",
            ended: "종료",
            unknown: "정보 없음",
        },
        detail: {
            loading: "공지 정보를 불러오는 중...",
            postedAt: "{date}에 등록됨",
            eventPeriod: "이벤트 기간",
            salePeriod: "판매 기간",
            error: "공지 내용을 불러오지 못했습니다.",
            openOriginal: "원문 열기",
        },
        errors: {
            list: "공지 목록을 불러오지 못했습니다. 다시 시도해 주세요.",
        },
        actions: {
            retry: "다시 시도",
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
