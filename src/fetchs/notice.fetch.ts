import { createApiCaller, createRequestRunner, type ApiParams } from "@/fetchs/apiClient";
import {
    ICashshopNoticeDetail,
    ICashshopNoticeListPayload,
    IEventNoticeDetail,
    IEventNoticeListPayload,
    INoticeDetail,
    INoticeListPayload,
    IUpdateNoticeDetail,
    IUpdateNoticeListPayload,
} from "@/interface/notice/INotice";
import { INoticeResponse } from "@/interface/notice/INoticeResponse";

const noticeRunner = createRequestRunner({ delayMs: 200 });
const callNoticeApiBase = createApiCaller({ basePath: "notice", runner: noticeRunner });

const callNoticeApi = <T>(endpoint: string, params: ApiParams = {}): Promise<INoticeResponse<T>> =>
    callNoticeApiBase<INoticeResponse<T>>(endpoint, params);

export const findNoticeList = () => callNoticeApi<INoticeListPayload>("notice");

export const findNoticeDetail = (noticeId: number | string) =>
    callNoticeApi<INoticeDetail>("notice-detail", { notice_id: noticeId });

export const findUpdateNoticeList = () =>
    callNoticeApi<IUpdateNoticeListPayload>("notice-update");

export const findUpdateNoticeDetail = (noticeId: number | string) =>
    callNoticeApi<IUpdateNoticeDetail>("notice-update-detail", { notice_id: noticeId });

export const findEventNoticeList = () =>
    callNoticeApi<IEventNoticeListPayload>("notice-event");

export const findEventNoticeDetail = (noticeId: number | string) =>
    callNoticeApi<IEventNoticeDetail>("notice-event-detail", { notice_id: noticeId });

export const findCashshopNoticeList = () =>
    callNoticeApi<ICashshopNoticeListPayload>("notice-cashshop");

export const findCashshopNoticeDetail = (noticeId: number | string) =>
    callNoticeApi<ICashshopNoticeDetail>("notice-cashshop-detail", { notice_id: noticeId });
