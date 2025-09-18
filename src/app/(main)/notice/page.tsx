'use client';

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  findCashshopNoticeDetail,
  findCashshopNoticeList,
  findEventNoticeDetail,
  findEventNoticeList,
  findNoticeDetail,
  findNoticeList,
  findUpdateNoticeDetail,
  findUpdateNoticeList,
} from '@/fetchs/notice.fetch';
import {
  ICashshopNoticeArticle,
  ICashshopNoticeDetail,
  IEventNoticeArticle,
  IEventNoticeDetail,
  INoticeArticle,
  INoticeDetail,
} from '@/interface/notice/INotice';
import { useTranslations } from '@/providers/LanguageProvider';

type NoticeCategory = 'notice' | 'update' | 'event' | 'cashshop';

type NoticeSummary = INoticeArticle | IEventNoticeArticle | ICashshopNoticeArticle;

type NoticeDetailData = INoticeDetail | IEventNoticeDetail | ICashshopNoticeDetail;

type NoticeListState = {
  items: NoticeSummary[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
};

type NoticeListStates = Record<NoticeCategory, NoticeListState>;

const createInitialListStates = (): NoticeListStates => ({
  notice: { items: [], loading: false, error: null, fetched: false },
  update: { items: [], loading: false, error: null, fetched: false },
  event: { items: [], loading: false, error: null, fetched: false },
  cashshop: { items: [], loading: false, error: null, fetched: false },
});

const initialDetailState = {
  open: false,
  loading: false,
  category: null as NoticeCategory | null,
  noticeId: null as number | null,
  summary: null as NoticeSummary | null,
  data: null as NoticeDetailData | null,
  error: null as string | null,
};

const NoticePage = () => {
  const t = useTranslations();
  const isMountedRef = useRef(true);
  const [activeTab, setActiveTab] = useState<NoticeCategory>('notice');
  const [listStates, setListStates] = useState<NoticeListStates>(() => createInitialListStates());
  const listStatesRef = useRef(listStates);
  const [detailState, setDetailState] = useState(initialDetailState);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateListState = useCallback(
    (category: NoticeCategory, updater: (prev: NoticeListState) => NoticeListState) => {
      setListStates((prev) => {
        const nextCategoryState = updater(prev[category]);
        const nextState = { ...prev, [category]: nextCategoryState };
        listStatesRef.current = nextState;
        return nextState;
      });
    },
    [],
  );

  const mergeListState = useCallback(
    (category: NoticeCategory, partial: Partial<NoticeListState>) => {
      updateListState(category, (prevState) => ({ ...prevState, ...partial }));
    },
    [updateListState],
  );

  const loadCategory = useCallback(
    async (category: NoticeCategory, options: { force?: boolean } = {}) => {
      const current = listStatesRef.current[category];
      if (current.loading) return;
      if (!options.force && current.fetched) return;

      mergeListState(category, { loading: true, error: null });

      try {
        let items: NoticeSummary[] = [];

        switch (category) {
          case 'notice': {
            const response = await findNoticeList();
            items = response.data.notice ?? [];
            break;
          }
          case 'update': {
            const response = await findUpdateNoticeList();
            items = response.data.update_notice ?? [];
            break;
          }
          case 'event': {
            const response = await findEventNoticeList();
            items = response.data.event_notice ?? [];
            break;
          }
          case 'cashshop': {
            const response = await findCashshopNoticeList();
            items = response.data.cashshop_notice ?? [];
            break;
          }
          default:
            return;
        }

        if (!isMountedRef.current) return;

        mergeListState(category, { items, loading: false, error: null, fetched: true });
      } catch (err) {
        if (!isMountedRef.current) return;

        const message = err instanceof Error ? err.message : String(err);

        updateListState(category, (prevState) => ({
          ...prevState,
          loading: false,
          error: message,
          fetched: options.force ? prevState.fetched : false,
        }));
      }
    },
    [mergeListState, updateListState],
  );

  useEffect(() => {
    const state = listStates[activeTab];
    if (!state.fetched && !state.loading && !state.error) {
      void loadCategory(activeTab);
    }
  }, [activeTab, listStates, loadCategory]);

  const formatDateTime = useCallback(
    (value: string | null | undefined) => {
      if (!value) return t('notice.table.noData');
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    [t],
  );

  const formatPeriod = useCallback(
    (start: string | null | undefined, end: string | null | undefined) => {
      if (!start && !end) return t('notice.table.noData');
      const formattedStart = start ? formatDateTime(start) : null;
      const formattedEnd = end ? formatDateTime(end) : null;

      if (formattedStart && formattedEnd) {
        return `${formattedStart} ~ ${formattedEnd}`;
      }
      if (formattedStart) {
        return `${formattedStart} ~`;
      }
      if (formattedEnd) {
        return `~ ${formattedEnd}`;
      }
      return t('notice.table.noData');
    },
    [formatDateTime, t],
  );

  const isOngoingSale = useCallback((flag: string | null | undefined) => {
    if (typeof flag !== 'string') return false;
    const normalized = flag.toLowerCase();
    return normalized === 'true' || normalized === 'y' || normalized === 'yes';
  }, []);

  const resolveSaleStatus = useCallback(
    (flag: string | null | undefined) => {
      if (isOngoingSale(flag)) {
        return t('notice.status.ongoing');
      }
      if (typeof flag === 'string') {
        return t('notice.status.ended');
      }
      return t('notice.status.unknown');
    },
    [isOngoingSale, t],
  );

  const handleRetry = useCallback(
    (category: NoticeCategory) => {
      void loadCategory(category, { force: true });
    },
    [loadCategory],
  );

  const handleSelectNotice = useCallback(
    (category: NoticeCategory, summary: NoticeSummary) => {
      setDetailState({
        open: true,
        loading: true,
        category,
        noticeId: summary.notice_id,
        summary,
        data: null,
        error: null,
      });

      const loadDetail = async () => {
        try {
          let response: { data: NoticeDetailData };

          switch (category) {
            case 'notice':
              response = await findNoticeDetail(summary.notice_id);
              break;
            case 'update':
              response = await findUpdateNoticeDetail(summary.notice_id);
              break;
            case 'event':
              response = await findEventNoticeDetail(summary.notice_id);
              break;
            case 'cashshop':
              response = await findCashshopNoticeDetail(summary.notice_id);
              break;
            default:
              return;
          }

          if (!isMountedRef.current) return;

          setDetailState((prev) => {
            if (
              !prev.open ||
              prev.noticeId !== summary.notice_id ||
              prev.category !== category
            ) {
              return prev;
            }
            return {
              ...prev,
              loading: false,
              data: response.data,
              error: null,
            };
          });
        } catch (err) {
          if (!isMountedRef.current) return;

          setDetailState((prev) => {
            if (
              !prev.open ||
              prev.noticeId !== summary.notice_id ||
              prev.category !== category
            ) {
              return prev;
            }
            return {
              ...prev,
              loading: false,
              error: err instanceof Error ? err.message : String(err),
            };
          });
        }
      };

      void loadDetail();
    },
    [],
  );

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDetailState({ ...initialDetailState });
    }
  }, []);

  const sanitizedContents = useMemo(() => {
    const contents = detailState.data?.contents;
    if (!contents) return '';
    if (typeof window === 'undefined') {
      return contents;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, 'text/html');
    doc.querySelectorAll('script, style').forEach((element) => element.remove());
    doc.querySelectorAll('a').forEach((element) => {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    });
    return doc.body.innerHTML;
  }, [detailState.data?.contents]);

  const renderList = (
    category: NoticeCategory,
    state: NoticeListState,
    options?: {
      renderHeaderCells?: () => ReactNode;
      renderRowCells?: (item: NoticeSummary) => ReactNode;
    },
  ) => {
    const { items, loading: isLoading, error: listError } = state;

    if (isLoading) {
      return (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      );
    }

    if (listError) {
      return (
        <div className="flex h-40 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          <p>{t('notice.errors.list')}</p>
          <p className="text-xs text-muted-foreground/70">{listError}</p>
          <Button variant="outline" size="sm" onClick={() => handleRetry(category)}>
            {t('notice.actions.retry')}
          </Button>
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t('notice.table.empty')}
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">{t('notice.table.headers.title')}</TableHead>
              <TableHead className="hidden w-48 text-right text-sm text-muted-foreground sm:table-cell">
                {t('notice.table.headers.date')}
              </TableHead>
              {options?.renderHeaderCells ? options.renderHeaderCells() : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={`${category}-${item.notice_id}`}
                className="cursor-pointer"
                onClick={() => handleSelectNotice(category, item)}
              >
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium leading-snug text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {formatDateTime(item.date)}
                    </p>
                    {category === 'event' ? (
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {formatPeriod(
                          (item as IEventNoticeArticle).date_event_start ?? null,
                          (item as IEventNoticeArticle).date_event_end ?? null,
                        )}
                      </p>
                    ) : null}
                    {category === 'cashshop' ? (
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:hidden">
                        <span>
                          {formatPeriod(
                            (item as ICashshopNoticeArticle).date_sale_start ?? null,
                            (item as ICashshopNoticeArticle).date_sale_end ?? null,
                          )}
                        </span>
                        <Badge variant={isOngoingSale((item as ICashshopNoticeArticle).ongoing_flag) ? 'default' : 'outline'}>
                          {resolveSaleStatus((item as ICashshopNoticeArticle).ongoing_flag)}
                        </Badge>
                      </div>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="hidden w-48 text-sm text-muted-foreground sm:table-cell">
                  {formatDateTime(item.date)}
                </TableCell>
                {options?.renderRowCells ? options.renderRowCells(item) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderUpdateList = () => renderList('update', listStates.update);
  const renderNoticeList = () => renderList('notice', listStates.notice);

  const renderEventList = () => {
    return renderList('event', listStates.event, {
      renderHeaderCells: () => (
        <TableHead className="hidden min-w-[240px] text-right text-sm text-muted-foreground md:table-cell">
          {t('notice.table.headers.period')}
        </TableHead>
      ),
      renderRowCells: (item) => (
        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
          {formatPeriod(
            (item as IEventNoticeArticle).date_event_start ?? null,
            (item as IEventNoticeArticle).date_event_end ?? null,
          )}
        </TableCell>
      ),
    });
  };

  const renderCashshopList = () => {
    return renderList('cashshop', listStates.cashshop, {
      renderHeaderCells: () => (
        <>
          <TableHead className="hidden min-w-[240px] text-right text-sm text-muted-foreground lg:table-cell">
            {t('notice.table.headers.salePeriod')}
          </TableHead>
          <TableHead className="hidden w-32 text-right text-sm text-muted-foreground lg:table-cell">
            {t('notice.table.headers.status')}
          </TableHead>
        </>
      ),
      renderRowCells: (item) => (
        <>
          <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
            {formatPeriod(
              (item as ICashshopNoticeArticle).date_sale_start ?? null,
              (item as ICashshopNoticeArticle).date_sale_end ?? null,
            )}
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <Badge variant={isOngoingSale((item as ICashshopNoticeArticle).ongoing_flag) ? 'default' : 'outline'}>
              {resolveSaleStatus((item as ICashshopNoticeArticle).ongoing_flag)}
            </Badge>
          </TableCell>
        </>
      ),
    });
  };

  const detailDate = detailState.data?.date ?? detailState.summary?.date ?? null;
  const detailLink = detailState.data?.url ?? detailState.summary?.url ?? null;

  const eventStart =
    detailState.category === 'event'
      ? (detailState.data as IEventNoticeDetail | null)?.date_event_start ??
        (detailState.summary as IEventNoticeArticle | null)?.date_event_start ??
        null
      : null;
  const eventEnd =
    detailState.category === 'event'
      ? (detailState.data as IEventNoticeDetail | null)?.date_event_end ??
        (detailState.summary as IEventNoticeArticle | null)?.date_event_end ??
        null
      : null;

  const saleStart =
    detailState.category === 'cashshop'
      ? (detailState.data as ICashshopNoticeDetail | null)?.date_sale_start ??
        (detailState.summary as ICashshopNoticeArticle | null)?.date_sale_start ??
        null
      : null;
  const saleEnd =
    detailState.category === 'cashshop'
      ? (detailState.data as ICashshopNoticeDetail | null)?.date_sale_end ??
        (detailState.summary as ICashshopNoticeArticle | null)?.date_sale_end ??
        null
      : null;
  const saleFlag =
    detailState.category === 'cashshop'
      ? (detailState.data as ICashshopNoticeDetail | null)?.ongoing_flag ??
        (detailState.summary as ICashshopNoticeArticle | null)?.ongoing_flag ??
        null
      : null;

  return (
    <div className="flex h-full flex-col gap-6">
      <Card className="flex-1 overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            {t('notice.title')}
          </CardTitle>
          <CardDescription>{t('notice.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-6 py-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NoticeCategory)}>
            <TabsList className="flex w-full flex-wrap gap-2">
              <TabsTrigger value="notice" className="flex-1 sm:flex-none">
                {t('notice.tabs.notice')}
              </TabsTrigger>
              <TabsTrigger value="update" className="flex-1 sm:flex-none">
                {t('notice.tabs.update')}
              </TabsTrigger>
              <TabsTrigger value="event" className="flex-1 sm:flex-none">
                {t('notice.tabs.event')}
              </TabsTrigger>
              <TabsTrigger value="cashshop" className="flex-1 sm:flex-none">
                {t('notice.tabs.cashshop')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notice" className="mt-4 space-y-4">
              {renderNoticeList()}
            </TabsContent>
            <TabsContent value="update" className="mt-4 space-y-4">
              {renderUpdateList()}
            </TabsContent>
            <TabsContent value="event" className="mt-4 space-y-4">
              {renderEventList()}
            </TabsContent>
            <TabsContent value="cashshop" className="mt-4 space-y-4">
              {renderCashshopList()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={detailState.open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold leading-tight">
              {detailState.data?.title ?? detailState.summary?.title ?? t('notice.detail.loading')}
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-muted-foreground">
              {detailDate ? t('notice.detail.postedAt', { date: formatDateTime(detailDate) }) : null}
            </DialogDescription>
          </DialogHeader>

          {detailState.category === 'event' ? (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t('notice.detail.eventPeriod')}:</span>{' '}
              {formatPeriod(eventStart, eventEnd)}
            </div>
          ) : null}

          {detailState.category === 'cashshop' ? (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-medium text-foreground">{t('notice.detail.salePeriod')}:</span>{' '}
                {formatPeriod(saleStart, saleEnd)}
              </div>
              <Badge variant={isOngoingSale(saleFlag) ? 'default' : 'outline'}>
                {resolveSaleStatus(saleFlag)}
              </Badge>
            </div>
          ) : null}

          <ScrollArea className="mt-4 max-h-[60vh] rounded-md border">
            <div className="p-4">
              {detailState.loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
                </div>
              ) : detailState.error ? (
                <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
                  <p>{t('notice.detail.error')}</p>
                  <p className="text-xs text-muted-foreground/70">{detailState.error}</p>
                </div>
              ) : detailState.data ? (
                <div
                  className="space-y-4 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_table]:w-full [&_th]:border [&_td]:border [&_th]:px-2 [&_td]:px-2"
                  dangerouslySetInnerHTML={{ __html: sanitizedContents }}
                />
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
                </div>
              )}
            </div>
          </ScrollArea>

          {detailLink ? (
            <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
              <a href={detailLink} target="_blank" rel="noopener noreferrer">
                {t('notice.detail.openOriginal')}
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticePage;
