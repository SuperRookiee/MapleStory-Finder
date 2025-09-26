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
        cancel: "Cancel",
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
    todoList: {
        navigation: {
            overview: "To Do list",
            dashboard: "Dashboard",
        },
        hero: {
            badge: "Finder boss planner",
            title: "Track your weekly and monthly bosses in one place",
            description:
                "Manage party schedules, clears, and personal notes without leaving the page.",
            resetInfo: "All MapleStory content resets every Thursday at 00:00 (KST).",
        },
        calendar: {
            title: "Schedule calendar",
            description: "Share boss runs with your party members and never miss a promise.",
            friendBadge: "Party schedule",
            currentMonth: "This month",
            today: "Today",
            selectedDate: "Selected date",
            selectedDescription: "Review the plans for the selected day and add new events.",
            empty: "No events yet.",
            remove: "Remove",
            edit: "Edit",
            addEvent: "Add event",
            dialog: {
                title: "Create event",
                editTitle: "Edit event",
                titleLabel: "Title",
                titlePlaceholder: "e.g. Evening Lucid run",
                friendLabel: "Party members",
                friendPlaceholder: "Separate names with commas or line breaks.",
                friendHelp: "Example: Night Lord, Demon Avenger, Hero",
                memoLabel: "Notes",
                memoPlaceholder: "Record roles or items you need to prepare.",
                dateLabel: "Date",
                dateHelp: "Dates can be adjusted within the selected month.",
                saving: "Saving...",
                editSaving: "Updating...",
                save: "Save",
                update: "Save changes",
            },
        },
        memos: {
            title: "Weekly notes",
            description: "Turn weekly goals and reminders into a simple checklist.",
            weeklyReset: "Resets every Thursday",
            addLabel: "This week's memo",
            placeholder: "Write down anything you want to remember.",
            saving: "Adding...",
            addButton: "Add memo",
            empty: "No memos yet.",
            completedLabel: "Done",
            todoLabel: "In progress",
            dueDateLabel: "Due {date}",
            noDueDate: "No date",
            edit: {
                title: "Edit memo",
                description: "Update the memo text and set a date if needed.",
                textLabel: "Memo text",
                dateLabel: "Date",
                clearDate: "Remove date",
                saving: "Updating...",
                save: "Save changes",
            },
        },
        bosses: {
            title: "Boss checklist",
            description: "Track daily, weekly, and monthly bosses in one place.",
            resetInfo: "Daily bosses reset every day, weekly bosses reset Thursday 00:00 KST, and monthly bosses reset on the 1st.",
            summary: {
                clears: "This week's clears",
                clearsHint: "Weekly boss clears recorded for this character.",
                reward: "Projected reward",
                rewardHint: "Calculated from base meso rewards.",
                worldReward: "{world} total",
                worldRewardHint: "Combined reward across every character in this world.",
            },
            selectors: {
                world: {
                    label: "Choose world",
                    placeholder: "Select a world",
                    unassigned: "Unassigned world",
                },
                character: {
                    label: "Choose character",
                    placeholder: "Select a character",
                    unassigned: "Unassigned character",
                },
            },
            characterEarnings: {
                title: "Earnings by character",
                description: "Runs recorded in {world}",
                totalLabel: "Total {value}",
                empty: "No character runs recorded yet.",
                clears: "Cleared {count} time(s)",
                helper: "Lv.{level} · {job}",
                openDialog: "View details",
                dialogTitle: "Earnings overview",
                dialogDescription: "Review clears and projected rewards for characters in {world}.",
                characterCount: "{count} character(s)",
            },
            groupBadge: "{count} bosses",
            rewardLabel: "Reward: {value}",
            status: {
                done: "Cleared",
                todo: "Pending",
            },
            difficulties: {
                easy: "Easy",
                normal: "Normal",
                hard: "Hard",
                chaos: "Chaos",
                extreme: "Extreme",
            },
            frequency: {
                daily: "Daily",
                weekly: "Weekly",
                monthly: "Monthly",
            },
            groups: {
                "daily-bosses": {
                    title: "Daily bosses",
                    description: "Keep an eye on bosses that reset every day.",
                },
                "weekly-bosses": {
                    title: "Weekly bosses",
                    description: "Manage everything that resets each week.",
                },
                "monthly-bosses": {
                    title: "Monthly bosses",
                    description: "Review bosses available once per month.",
                },
            },
        },
        toast: {
            error: "Something went wrong while loading or saving your data.",
            memoAdded: "Memo added.",
            memoUpdated: "Memo updated.",
            memoRemoved: "Memo removed.",
            eventAdded: "Event created.",
            eventUpdated: "Event updated.",
            eventRemoved: "Event removed.",
            weeklyWorldLimit: "A world can track up to {limit} weekly bosses.",
            weeklyCharacterLimit: "Each character can clear up to {limit} weekly bosses.",
        },
        dashboard: {
            cards: {
                weeklyClears: {
                    title: "Weekly clears",
                    description: "Runs completed this week",
                    subtitle: "{total} runs available",
                },
                reward: {
                    title: "Projected reward",
                    description: "Total mesos this week",
                    subtitle: "Based on the default boss reward.",
                },
                progress: {
                    title: "Completion rate",
                    description: "Weekly progress",
                    subtitle: "Compared to all tracked bosses.",
                },
                monthly: {
                    title: "Monthly clears",
                    description: "Monthly boss activity",
                    subtitle: "Based on {value} recorded months.",
                },
            },
            weeklyTrend: {
                title: "Weekly trend",
                description: "Compare clears and rewards across the last 12 weeks.",
                badge: "Last 12 weeks",
                rewardLabel: "Projected reward",
                clearLabel: "Clears",
                clears: "Clears",
                reward: "Reward (billions)",
            },
            groupStats: {
                title: "Frequency breakdown",
                description: "Completion status and projected reward by reset frequency.",
                subtitle: "{cleared}/{total} cleared",
                reward: "Projected reward",
            },
            monthly: {
                title: "Monthly history",
                description: "Monthly boss clears recorded over the last six months.",
                barLabel: "Monthly boss clears",
                tooltipLabel: "Monthly clears",
                tooltipValue: "Cleared {value} of {total}",
                summary: "Monthly bosses were cleared {value, plural, one {once} other {# times}} in total. ({total} available)",
            },
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
        hero: {
            badge: "Favorites dashboard",
            title: "Keep your favourites close",
            description:
                "Browse the characters you pinned and jump to detailed stats whenever you need them.",
        },
        stats: {
            totalFavorites: "Saved favourites",
            totalFavoritesHelper: "{count} characters are pinned for quick access.",
            totalFavoritesHelperEmpty: "Pin a character to keep it ready for quick access.",
            selected: "Current selection",
            selectedHelper: "Choose a character from the list to preview gear instantly.",
            level: "Lv. {level}",
            none: "—",
        },
        favorites: {
            title: "Favourite characters",
            description: "Pick a character from the list to see an instant preview of their equipment.",
            empty: "No favourites yet. Add a character to your favourites to display it here.",
        },
        characterInfo: {
            emptyState: "Please choose your character",
            detailButton: "Detail",
        },
        dialog: {
            title: "Info",
        },
    },
    characterList: {
        header: {
            badge: "Roster overview",
            title: "Manage your MapleStory roster",
            description:
                "Filter the characters linked to your account and open their detailed pages in a single click.",
        },
        stats: {
            total: "Synced characters",
            filtered: "Visible with filters",
            favorites: "Saved favourites",
            totalHelper: "Characters fetched from your linked account.",
            filteredHelper: "Filtered by {world}.",
            favoritesHelper: "{count} favourites saved across the app.",
        },
        filters: {
            title: "Filters",
            description: "Choose a world or search by name to narrow down the list.",
            world: {
                label: "World",
                all: "All worlds",
            },
            search: {
                label: "Search",
                placeholder: "Search character name...",
            },
        },
        list: {
            title: "Character overview",
            description: "Select a card to open the full character detail page.",
        },
        empty: {
            title: "No characters match your filters",
            description: "Try selecting another world or refresh the sync to load your roster again.",
        },
    },
    notice: {
        title: "Official MapleStory notices",
        description:
            "Browse the latest announcements, update notes, event guides, and cash shop news in one place.",
        tabs: {
            notice: "Announcements",
            update: "Updates",
            event: "Events",
            cashshop: "Cash Shop",
        },
        table: {
            headers: {
                title: "Title",
                date: "Published",
                period: "Event period",
                salePeriod: "Sales period",
                status: "Status",
            },
            empty: "No posts are available right now.",
            noData: "—",
        },
        status: {
            ongoing: "Ongoing",
            ended: "Ended",
            unknown: "Unknown",
        },
        detail: {
            loading: "Loading notice...",
            postedAt: "Posted on {date}",
            eventPeriod: "Event period",
            salePeriod: "Sales period",
            error: "We couldn't load this notice.",
            openOriginal: "Open original post",
        },
        errors: {
            list: "We couldn't load the notices. Please try again.",
        },
        actions: {
            retry: "Retry",
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
            common: {
                preset: "Preset {number}",
            },
            sections: {
                ability: {
                    title: "Ability",
                },
                android: {
                    title: "Android",
                    grade: "{grade} Grade",
                },
                beauty: {
                    title: "Appearance",
                    hair: "Hair",
                    face: "Face",
                    skin: "Skin",
                },
                cash: {
                    title: "Cash Equipment",
                },
                dojang: {
                    title: "Mu Lung Dojo",
                    bestFloor: "Highest floor: {floor}F",
                    bestTime: "Record: {time}s",
                },
                hexaMatrix: {
                    title: "Hexa Matrix",
                },
                hexaStat: {
                    title: "Hexa Stats",
                },
                hyperStat: {
                    title: "Hyper Stats",
                    availablePoints: "Available points: {value}",
                },
                linkSkill: {
                    title: "Link Skills",
                },
                otherStat: {
                    title: "Other Stats",
                    empty: "No information available.",
                },
                pet: {
                    title: "Pets",
                },
                propensity: {
                    title: "Traits",
                    labels: {
                        charisma: "Charisma",
                        empathy: "Empathy",
                        insight: "Insight",
                        willpower: "Willpower",
                        diligence: "Diligence",
                        charm: "Charm",
                    },
                },
                ring: {
                    title: "Special Ring",
                },
                setEffect: {
                    title: "Set Effects",
                    entry: "{count}-set: {option}",
                },
                skill: {
                    title: "Skills",
                },
                symbol: {
                    title: "Symbols",
                },
                union: {
                    title: "Union",
                    level: "Level",
                    grade: "Rank",
                    artifactLevel: "Artifact Level",
                    raiderEffects: "Raid member effects",
                    artifactEffects: "Artifact effects",
                },
                vMatrix: {
                    title: "V Matrix",
                },
            },
            stat: {
                battlePower: "Combat Power",
                labels: {
                    statAttack: "Stat ATT",
                    attackPower: "Attack Power",
                    magicAttack: "Magic ATT",
                    damage: "Damage",
                    finalDamage: "Final Damage",
                    bossDamage: "Boss Damage",
                    normalDamage: "Damage to Normal Monsters",
                    ignoreDefense: "Ignore DEF",
                    critRate: "Critical Rate",
                    critDamage: "Critical Damage",
                    cooldownReductionSeconds: "Cooldown Reduction (s)",
                    cooldownReductionPercent: "Cooldown Reduction (%)",
                    cooldownIgnore: "Cooldown Skip",
                    statusDamage: "Damage to Statused Enemies",
                    buffDuration: "Buff Duration",
                    attackSpeed: "Attack Speed",
                    weaponMastery: "Weapon Mastery",
                    mesoObtained: "Meso Obtained",
                    itemDropRate: "Item Drop Rate",
                    bonusExp: "Bonus EXP",
                    starForce: "Star Force",
                    arcaneForce: "Arcane Force",
                    authenticForce: "Authentic Force",
                    speed: "Speed",
                    jump: "Jump",
                    statusResistance: "Status Resistance",
                    stance: "Stance",
                },
            },
        },
        banner: {
            union: "Union Lv. {level}",
            dojang: "Mu Lung {floor}F",
            ranking: "Overall Rank #{value}",
            guild: "Guild {name}",
            figure: "Figure",
            figureTooltip: "This feature is still under development.",
            starforce: "Starforce",
            cube: "Cube",
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
        item: {
            equipment: {
                title: "Equipment",
                mainOptions: {
                    allStat: "All Stat",
                    maxHp: "Max HP",
                    maxMp: "Max MP",
                    attackPower: "ATT",
                    magicPower: "Magic ATT",
                    armor: "Defense",
                },
                potential: {
                    label: "Potential Options",
                    gradeLabel: "({grade} item)",
                },
                additionalPotential: {
                    label: "Additional Potential",
                },
            },
        },
    },
    history: {
        common: {
            error: "An error occurred while fetching probability information.",
            countError: "Please enter an integer between 10 and 1000 for the result count.",
            initial: "Enter a date and count to begin searching.",
            empty: "No history records were found.",
            form: {
                date: "Reference date",
                count: "Result count",
                countHint: "You can request between 10 and 1,000 results at a time.",
                submit: "Search",
                loading: "Loading...",
                loadMore: "Load more",
                result: "Showing {count} records.",
            },
        },
        starforce: {
            title: "Starforce Enhancement History",
            description: "Browse published Starforce enhancement results by date. Data is available for up to the last two years.",
            labels: {
                stars: "{before}★ → {after}★",
                scroll: "Scroll used",
            },
            flags: {
                superior: "Superior item",
                starcatch: "Star Catch",
                destroyDefence: "Safeguard",
                chanceTime: "Chance Time",
                eventField: "Event Field",
                protectShield: "Protect Shield",
                bonusStat: "Bonus stat item",
            },
            event: {
                success: "Success rate",
                destroy: "Destroy rate decrease",
                discount: "Cost discount",
                plus: "Bonus stars",
            },
        },
        cube: {
            title: "Cube Usage History",
            description: "Review cube results and potential changes by date. Data is available for up to the last two years.",
            flags: {
                miracleTime: "Miracle Time",
                guaranteed: "Guaranteed rank-up",
                stacks: "{count} stack(s)",
            },
            labels: {
                part: "Equipment: {part}",
                level: "Item level {level}",
                potential: "Potential {grade}",
                additionalPotential: "Additional potential {grade}",
                beforePotential: "Before potential",
                afterPotential: "After potential",
                beforeAdditional: "Before additional",
                afterAdditional: "After additional",
            },
            emptyOption: "No option data provided.",
        },
    },
} as const;
