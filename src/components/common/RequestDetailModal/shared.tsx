import type { LucideIcon } from 'lucide-react';
import {
  AlertCircleIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  HistoryIcon,
  LayersIcon,
  LoaderIcon,
  MessageSquareIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';
import { VisuallyHidden } from 'radix-ui';
import { useCallback, useMemo, useState } from 'react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ModalHeader, ModalTitle } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatUserName } from '@/features/dashboard/utils';
import type {
  RequestDetailResponse,
  TrackingEntry,
} from '@/services/auth/types';
import { priorityMap } from '@/types/Priority';
import type { Status } from '@/types/Status';
import { statusMap } from '@/types/Status';

const COMMENT_CHAR_LIMIT = 170;
const STATUS_HISTORY_LIMIT = 2;

const statusDotClass: Record<Status, string> = {
  draft: 'bg-gray-400 ring-gray-200',
  submitted: 'bg-sky-400 ring-sky-200',
  cancelled: 'bg-gray-400 ring-gray-200',
  in_progress: 'bg-indigo-400 ring-indigo-200',
  approved: 'bg-green-400 ring-green-200',
  rejected: 'bg-red-400 ring-red-200',
  completed: 'bg-teal-400 ring-teal-200',
};

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part) =>
    /^https?:\/\/[^\s]+$/.test(part) ? (
      <a
        key={part}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function InfoField({
  icon,
  label,
  value,
  isBlock = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  isBlock?: boolean;
}) {
  return (
    <div className="min-w-0">
      <SectionLabel icon={icon} label={label} />
      <p
        className={`text-sm text-foreground/80 ${isBlock ? 'leading-relaxed text-justify' : 'font-semibold wrap-break-word'}`}
        style={
          isBlock
            ? {
                overflowWrap: 'break-word',
                hyphens: 'auto',
                wordBreak: 'break-word',
              }
            : undefined
        }
      >
        {value ? (isBlock ? renderTextWithLinks(value) : value) : '-'}
      </p>
    </div>
  );
}

export function ParticipantInfo({
  user,
}: {
  user: {
    first_name: string;
    last_name: string;
    email?: string;
    role?: string;
    avatar_url?: string | null;
  };
}) {
  const name = formatUserName(user);

  return (
    <div className="flex items-center gap-3">
      <UserAvatar
        avatarUrl={user.avatar_url}
        name={name}
        className="h-12 w-12"
      />
      <div className="min-w-0">
        {user.role && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-1">
            {user.role}
          </p>
        )}
        <p className="text-sm font-medium text-foreground">{name}</p>
        {user.email && (
          <p
            className="text-xs text-muted-foreground lowercase truncate"
            title={user.email}
          >
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
}

export function StatusHistoryItem({
  status,
  userName,
  date,
  isLast = false,
}: {
  status: Status;
  userName: string;
  date?: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full ring-2 shrink-0 mt-1 ${statusDotClass[status]}`}
        />
        {!isLast && <div className="w-px flex-1 bg-border mt-1.5" />}
      </div>
      <div className={`min-w-0 -mt-0.5 ${!isLast ? 'pb-4' : ''}`}>
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-semibold text-foreground">
            {statusMap[status].label}
          </p>
          {date && (
            <span className="text-[11px] text-muted-foreground/60">
              {formatDate(date)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{userName}</p>
      </div>
    </div>
  );
}

export function TrackingCommentItem({
  userName,
  avatarUrl,
  comment,
  date,
  status,
}: {
  userName: string;
  avatarUrl?: string | null;
  comment: string;
  date?: string;
  status: Status;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = comment.length > COMMENT_CHAR_LIMIT;
  const displayed =
    isLong && !isExpanded
      ? `${comment.slice(0, COMMENT_CHAR_LIMIT)}…`
      : comment;

  return (
    <div className="flex gap-3">
      <UserAvatar
        avatarUrl={avatarUrl}
        name={userName}
        className="h-7 w-7 shrink-0"
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="text-xs font-medium text-foreground">{userName}</p>
          <Badge
            variant="outline"
            className={`${statusMap[status].className} text-[10px] px-1.5 py-0`}
          >
            {statusMap[status].label}
          </Badge>
          {date && (
            <span className="text-[11px] text-muted-foreground/60">
              {formatDate(date)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground/80 mt-0.5 italic leading-relaxed wrap-break-word">
          {displayed}
          {isLong && (
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="ml-1 not-italic text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? 'less' : 'more'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export function SidebarCard({
  icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="mb-4">
          <SectionLabel icon={icon} label={title} />
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-12">
      <VisuallyHidden.Root>
        <ModalTitle>Loading request details</ModalTitle>
      </VisuallyHidden.Root>
      <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3">
      <VisuallyHidden.Root>
        <ModalTitle>Error loading request</ModalTitle>
      </VisuallyHidden.Root>
      <AlertCircleIcon className="h-8 w-8 text-destructive" />
      <p className="text-sm text-muted-foreground">
        Failed to load request details
      </p>
    </div>
  );
}

export function RequestDetailLayout({
  request,
  tracking,
  actions,
}: {
  request: RequestDetailResponse;
  tracking: TrackingEntry[];
  actions?: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const participants = useMemo(
    () =>
      tracking.reduce(
        (acc, entry) => {
          if (!acc.some((u) => u.id === entry.user.id)) {
            acc.push(entry.user);
          }
          return acc;
        },
        [] as TrackingEntry['user'][],
      ),
    [tracking],
  );

  const trackingWithComments = useMemo(
    () => tracking.filter((e) => e.comment),
    [tracking],
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrolled = e.currentTarget.scrollTop > 0;
    setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100dvh-2rem)] overflow-hidden">
      <ModalHeader className="flex-row items-center gap-2 p-6 pb-0 shrink-0">
        <div className="px-3">
          <span
            className={priorityMap[request.priority].className}
            title={priorityMap[request.priority].label}
          >
            {priorityMap[request.priority].icon}
          </span>
        </div>
        <ModalTitle className="text-xl min-w-0 wrap-break-word">
          <span className="rounded-sm">#{request.id} </span>
          {request.title}
        </ModalTitle>
        <div className="flex px-3">
          <Badge
            variant="outline"
            className={statusMap[request.current_status].className}
          >
            {statusMap[request.current_status].label}
          </Badge>
        </div>
      </ModalHeader>

      <div className="relative flex-1 min-h-0">
        {isScrolled && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-12 bg-linear-to-b from-background to-transparent" />
        )}

        <ScrollArea
          className="h-full overflow-hidden"
          onScrollCapture={handleScroll}
        >
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 min-w-0 p-6 space-y-4">
              <Card size="sm">
                <CardContent className="space-y-6 mx-3">
                  <div className="grid grid-cols-2 gap-8 *:min-w-0">
                    <InfoField
                      icon={TagIcon}
                      label="Type"
                      value={request.type.name}
                    />
                    <InfoField
                      icon={LayersIcon}
                      label="Subtype"
                      value={request.subtype.name}
                    />
                  </div>
                  <InfoField
                    icon={FileTextIcon}
                    label="Description"
                    value={request.description}
                    isBlock
                  />
                  <InfoField
                    icon={BriefcaseIcon}
                    label="Business Justification"
                    value={request.business_justification}
                    isBlock
                  />
                </CardContent>
              </Card>

              {trackingWithComments.length > 0 && (
                <SidebarCard icon={MessageSquareIcon} title="Comments">
                  <ScrollArea className="max-h-96 overflow-hidden">
                    <div className="space-y-4 pr-3">
                      {trackingWithComments.map((entry) => (
                        <TrackingCommentItem
                          key={entry.id}
                          userName={formatUserName(entry.user)}
                          avatarUrl={entry.user.avatar_url}
                          comment={entry.comment}
                          date={entry.created_at}
                          status={entry.status}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </SidebarCard>
              )}
            </div>

            {/* Sidebar */}
            <div className="min-w-2xs p-6 space-y-4">
              <SidebarCard icon={UsersIcon} title="Participants">
                <div className="space-y-3">
                  {request.requester && (
                    <ParticipantInfo user={request.requester} />
                  )}
                  {request.assignee &&
                    request.assignee.id !== request.requester?.id && (
                      <ParticipantInfo user={request.assignee} />
                    )}
                  {participants
                    .filter(
                      (u) =>
                        u.id !== request.assignee?.id &&
                        u.id !== request.requester?.id,
                    )
                    .map((user) => (
                      <ParticipantInfo key={user.id} user={user} />
                    ))}
                </div>
              </SidebarCard>

              <SidebarCard icon={HistoryIcon} title="Status History">
                {tracking.length > 0 ? (
                  <>
                    <div>
                      {(isHistoryExpanded
                        ? tracking
                        : tracking.slice(0, STATUS_HISTORY_LIMIT)
                      ).map((entry, i, arr) => (
                        <StatusHistoryItem
                          key={entry.id}
                          status={entry.status}
                          userName={formatUserName(entry.user)}
                          date={entry.created_at}
                          isLast={i === arr.length - 1}
                        />
                      ))}
                    </div>
                    {tracking.length > STATUS_HISTORY_LIMIT && (
                      <button
                        type="button"
                        onClick={() => setIsHistoryExpanded((v) => !v)}
                        className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isHistoryExpanded ? (
                          <>
                            <ChevronUpIcon className="h-3 w-3" /> Show less
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="h-3 w-3" />
                            {tracking.length - STATUS_HISTORY_LIMIT} more
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <StatusHistoryItem
                    status={request.current_status}
                    userName={formatUserName(
                      request.assignee ?? request.requester,
                    )}
                  />
                )}
              </SidebarCard>
            </div>
          </div>
        </ScrollArea>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
      </div>

      {actions && <div className="border-t shrink-0">{actions}</div>}
    </div>
  );
}
