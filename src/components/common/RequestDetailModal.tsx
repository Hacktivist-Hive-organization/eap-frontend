import type { LucideIcon } from 'lucide-react';
import {
  AlertCircleIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  CircleIcon,
  EraserIcon,
  FileTextIcon,
  HistoryIcon,
  LayersIcon,
  LoaderIcon,
  SendHorizonalIcon,
  TagIcon,
  UsersIcon,
  XCircleIcon,
} from 'lucide-react';
import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useApproverRequestById } from '@/features/dashboard/ApproverDashboard/hooks/useApproverRequestById';
import { useProcessRequest } from '@/features/dashboard/RequesterDashboard/hooks/useProcessRequest';
import { useRequestById } from '@/features/dashboard/RequesterDashboard/hooks/useRequestById';
import { useRequestTracking } from '@/features/dashboard/RequesterDashboard/hooks/useRequestTracking';
import { useSubmitDraft } from '@/features/dashboard/RequesterDashboard/hooks/useSubmitDraft';
import { formatUserName } from '@/features/dashboard/utils';
import { useAppSelector } from '@/hooks/useRedux';
import { priorityMap } from '@/types/Priority';
import type { Status } from '@/types/Status';
import { statusMap } from '@/types/Status';
import { getInitials } from '@/utils';

interface RequestDetailModalProps {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sub-components

function SectionLabel({
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

function InfoField({
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
    <div>
      <SectionLabel icon={icon} label={label} />
      <p
        className={`text-sm text-foreground/80 ${isBlock ? 'leading-relaxed text-justify max-h-40 overflow-y-auto' : 'font-semibold'}`}
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
        {value || '-'}
      </p>
    </div>
  );
}

function ParticipantInfo({
  user,
}: {
  user: {
    first_name: string;
    last_name: string;
    email?: string;
    role?: string;
  };
}) {
  const name = formatUserName(user);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        {user.role && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-1">
            {user.role}
          </p>
        )}
        <p className="text-sm font-medium text-foreground">{name}</p>
        {user.email && (
          <p className="text-xs text-muted-foreground lowercase">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusHistoryItem({
  status,
  userName,
  comment,
}: {
  status: Status;
  userName: string;
  comment?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <CircleIcon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 -mt-0.5">
        <p className="text-sm font-semibold text-foreground">
          {statusMap[status].label}
        </p>
        <p className="text-xs text-muted-foreground">To {userName}</p>
        {comment && (
          <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
            {comment}
          </p>
        )}
      </div>
    </div>
  );
}

function SidebarCard({
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
        <div className="flex items-center gap-2 mb-4">
          <SectionLabel icon={icon} label={title} />
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center p-12">
      <VisuallyHidden.Root>
        <ModalTitle>Loading request details</ModalTitle>
      </VisuallyHidden.Root>
      <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function ErrorState() {
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

// Main component

export function RequestDetailModal({
  requestId,
  open,
  onOpenChange,
}: RequestDetailModalProps) {
  const role = useAppSelector((state) => state.userState.user?.role);
  const isApprover = role === 'approver';
  const {
    data: requesterData,
    isLoading: isLoadingRequester,
    isError: isErrorRequester,
  } = useRequestById(isApprover ? 0 : requestId);
  const {
    data: approverData,
    isLoading: isLoadingApprover,
    isError: isErrorApprover,
  } = useApproverRequestById(isApprover ? requestId : 0);
  const request = approverData ?? requesterData;
  const isLoading = isApprover ? isLoadingApprover : isLoadingRequester;
  const isError = isApprover ? isErrorApprover : isErrorRequester;
  const { data: tracking = [] } = useRequestTracking(requestId);
  const submitDraft = useSubmitDraft();
  const processRequest = useProcessRequest();
  const [isScrolled, setIsScrolled] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    'approved' | 'rejected' | null
  >(null);
  const [comment, setComment] = useState('');

  const handleSubmitDraft = () => {
    submitDraft.mutate(requestId, {
      onSuccess: () => {
        toast.success('Request submitted successfully');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to submit request');
      },
    });
  };

  const handleCancel = () => {
    processRequest.mutate(
      { id: requestId, status: 'cancelled' },
      {
        onSuccess: () => {
          toast.success('Request cancelled');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to cancel request');
        },
      },
    );
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;
    processRequest.mutate(
      {
        id: requestId,
        status: pendingAction,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            pendingAction === 'approved'
              ? 'Request approved'
              : 'Request rejected',
          );
          onOpenChange(false);
        },
        onError: () => {
          toast.error(
            pendingAction === 'approved'
              ? 'Failed to approve request'
              : 'Failed to reject request',
          );
        },
      },
    );
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setComment('');
  };

  const participants = tracking.reduce(
    (acc, entry) => {
      if (!acc.some((u) => u.id === entry.user.id)) {
        acc.push(entry.user);
      }
      return acc;
    },
    [] as (typeof tracking)[number]['user'][],
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0);
  };

  if (isLoading) {
    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-5xl p-0">
          <LoadingState />
        </ModalContent>
      </Modal>
    );
  }

  if (isError || !request) {
    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-5xl p-0">
          <ErrorState />
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl p-0">
        <ModalHeader className="flex-row items-center gap-2 p-6 pb-0">
          <div className="px-3">
            <span
              className={priorityMap[request.priority].className}
              title={priorityMap[request.priority].label}
            >
              {priorityMap[request.priority].icon}
            </span>
          </div>
          <ModalTitle className="text-xl">
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

        <div className="relative">
          {isScrolled && (
            <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-12 bg-linear-to-b from-background to-transparent" />
          )}

          <ScrollArea
            className="max-h-[90vh] overflow-y-auto"
            onScroll={handleScroll}
          >
            <div className="flex">
              {/* Main Content */}
              <div className="flex-1 min-w-0 p-6">
                <Card size="sm">
                  <CardContent className="space-y-6 mx-3">
                    <div className="grid grid-cols-2 gap-8">
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
                  <div className="space-y-3">
                    {tracking.length > 0 ? (
                      tracking.map((entry) => (
                        <StatusHistoryItem
                          key={entry.id}
                          status={entry.status}
                          userName={formatUserName(entry.user)}
                          comment={entry.comment}
                        />
                      ))
                    ) : (
                      <StatusHistoryItem
                        status={request.current_status}
                        userName={formatUserName(
                          request.assignee ?? request.requester,
                        )}
                      />
                    )}
                  </div>
                </SidebarCard>
              </div>
            </div>
          </ScrollArea>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
        </div>

        {role === 'requester' &&
          (request.current_status === 'draft' ||
            request.current_status === 'submitted') && (
            <div className="flex justify-end px-6 py-4 border-t">
              {request.current_status === 'draft' && (
                <Button
                  onClick={handleSubmitDraft}
                  disabled={submitDraft.isPending}
                >
                  <SendHorizonalIcon />
                  {submitDraft.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
              {request.current_status === 'submitted' && (
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={processRequest.isPending}
                >
                  <EraserIcon />
                  {processRequest.isPending
                    ? 'Cancelling...'
                    : 'Cancel Request'}
                </Button>
              )}
            </div>
          )}

        {role === 'approver' && request.current_status === 'submitted' && (
          <div className="flex flex-col gap-3 px-6 py-4 border-t">
            {pendingAction ? (
              <>
                <Textarea
                  placeholder={
                    pendingAction === 'rejected'
                      ? 'Comment is required'
                      : 'Add a comment (optional)'
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleCancelAction}
                    disabled={processRequest.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={
                      pendingAction === 'rejected' ? 'destructive' : 'default'
                    }
                    onClick={handleConfirmAction}
                    disabled={
                      processRequest.isPending ||
                      (pendingAction === 'rejected' && !comment.trim())
                    }
                  >
                    {pendingAction === 'rejected' ? (
                      <XCircleIcon />
                    ) : (
                      <CheckCircle2Icon />
                    )}
                    {processRequest.isPending
                      ? 'Processing...'
                      : pendingAction === 'rejected'
                        ? 'Confirm Reject'
                        : 'Confirm Approve'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPendingAction('rejected')}
                  disabled={processRequest.isPending}
                >
                  <XCircleIcon />
                  Reject
                </Button>
                <Button
                  onClick={() => setPendingAction('approved')}
                  disabled={processRequest.isPending}
                >
                  <CheckCircle2Icon />
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
