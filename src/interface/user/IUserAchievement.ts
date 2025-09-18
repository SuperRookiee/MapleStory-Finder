export interface IUserAchievementSummary {
    trophy_id: number;
    trophy_name: string;
    trophy_grade: string;
    trophy_score: number;
    trophy_icon?: string;
    trophy_description?: string;
    trophy_condition?: string;
    trophy_type?: string;
    trophy_category_name?: string;
    trophy_group_name?: string;
    achieve_date?: string;
}

export interface IUserAchievement {
    account_id?: string;
    character_name?: string;
    world_name?: string;
    trophy_grade?: string;
    trophy_score?: number;
    next_grade_score?: number;
    total_trophy_count?: number;
    date?: string;
    trophy_list?: IUserAchievementSummary[];
    [key: string]: unknown;
}
