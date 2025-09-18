export const en = {
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
        maintenanceDialog: {
            title: "Maintenance notice",
            description:
                "The MapleStory API is currently undergoing maintenance. Please try again in a little while.",
            confirm: "OK",
        },
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
    offline: {
        title: "You're offline",
        description:
            "Check your connection and try again. Recently visited pages may still be available offline.",
        actions: {
            retry: "Retry",
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
            ranking: "Overall Rank #{value}",
            guild: "Guild {name}",
            figure: "Figure",
            figureTooltip: "This feature is still under development.",
        },
        ranking: {
            title: "Ranking",
            overall: "Overall",
            union: "Union",
            dojang: "Mu Lung Dojo",
            theseed: "The Seed",
            achievement: "Achievement",
            level: "Level {level}",
            unionDetail: "Level {level} · Power {power}",
            floor: "Floor {floor}",
            record: "Record {time}",
            achievementDetail: "Grade {grade} · Score {score}",
            updated: "As of {date}",
            empty: "No ranking data available.",
        },
    },
} as const;
