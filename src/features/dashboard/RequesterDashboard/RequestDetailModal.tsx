import type { LucideIcon } from 'lucide-react';
import {
  AlertCircleIcon,
  BriefcaseIcon,
  CircleIcon,
  FileTextIcon,
  HistoryIcon,
  LayersIcon,
  LoaderIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react';
import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';
import Avatar from 'react-avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRequestById } from '@/features/dashboard/RequesterDashboard/hooks/useRequestById';
import {
  formatLastUpdate,
  formatUserName,
} from '@/features/dashboard/RequesterDashboard/utils';
import { priorityMap } from '@/types/Priority';
import type { Status } from '@/types/Status';
import { statusMap } from '@/types/Status';

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
        className={`text-sm text-foreground/80 ${isBlock ? 'leading-relaxed text-justify' : 'font-semibold'}`}
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
      <Avatar name={name} size="36" round />
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
  timestamp,
  userName,
}: {
  status: Status;
  timestamp: string;
  userName: string;
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
        <p className="text-xs font-medium text-muted-foreground">
          {formatLastUpdate(timestamp)}
        </p>
        <p className="text-xs text-muted-foreground">By {userName}</p>
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
  const { data: request, isLoading, isError } = useRequestById(requestId);
  const [isScrolled, setIsScrolled] = useState(false);

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
              className={statusMap[request.status].className}
            >
              {statusMap[request.status].label}
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
              <div className="flex-1 p-6">
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
                  {request.requester && (
                    <ParticipantInfo user={request.requester} />
                  )}
                </SidebarCard>

                <SidebarCard icon={HistoryIcon} title="Status History">
                  {request.requester && (
                    <StatusHistoryItem
                      status={request.status}
                      timestamp={request.updated_at ?? request.created_at}
                      userName={formatUserName(request.requester)}
                    />
                  )}
                </SidebarCard>
              </div>
            </div>
          </ScrollArea>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
        </div>
      </ModalContent>
    </Modal>
  );
}
