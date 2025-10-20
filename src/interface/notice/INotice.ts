export interface INoticeArticle {
    title: string;
    url: string;
    notice_id: number;
    date: string;
}

export type INoticeListPayload = {
    notice: INoticeArticle[];
};

export type INoticeDetail = {
    title: string;
    url: string;
    contents: string;
    date: string;
};

export type IUpdateNoticeListPayload = {
    update_notice: INoticeArticle[];
};

export type IUpdateNoticeDetail = INoticeDetail;

export interface IEventNoticeArticle extends INoticeArticle {
    date_event_start: string | null;
    date_event_end: string | null;
}

export type IEventNoticeListPayload = {
    event_notice: IEventNoticeArticle[];
};

export interface IEventNoticeDetail extends INoticeDetail {
    date_event_start: string | null;
    date_event_end: string | null;
}

