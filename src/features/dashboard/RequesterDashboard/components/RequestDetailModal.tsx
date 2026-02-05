import {
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
import { formatLastUpdate } from '@/components/common/RequestsTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRequestById } from '@/features/dashboard/RequesterDashboard/hooks';
import { formatUserName } from '@/features/dashboard/RequesterDashboard/utils';
import { priorityMap } from '@/types/Priority';
import { statusMap } from '@/types/Status';

interface RequestDetailModalProps {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailModal({
  requestId,
  open,
  onOpenChange,
}: RequestDetailModalProps) {
  const { data: request, isLoading } = useRequestById(requestId);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl p-0">
        {isLoading || !request ? (
          <div className="flex items-center justify-center p-12">
            <VisuallyHidden.Root>
              <ModalTitle>Loading request details</ModalTitle>
            </VisuallyHidden.Root>
            <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
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
                        {/* Type and Subtype */}
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <TagIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                                Type
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-foreground/80">
                              {request.type.name}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <LayersIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                                Subtype
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-foreground/80">
                              {request.subtype.name}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                              Description
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed text-justify">
                            {request.description || '-'}
                          </p>
                        </div>

                        {/* Business Justification */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                              Business Justification
                            </p>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed text-justify">
                            {request.business_justification || '-'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="min-w-2xs p-6 space-y-4">
                    {/* Participants */}
                    <Card size="sm">
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Participants
                          </span>
                        </div>
                        {request.requester && (
                          <div>
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={formatUserName(request.requester)}
                                size="36"
                                round
                              />

                              <div className="min-w-0">
                                {request.requester.role && (
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-1">
                                    {request.requester.role}
                                  </p>
                                )}
                                <p className="text-sm font-medium text-foreground">
                                  {formatUserName(request.requester)}
                                </p>
                                {request.requester.email && (
                                  <p className="text-xs text-muted-foreground lowercase">
                                    {request.requester.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Status history */}
                    <Card size="sm">
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <HistoryIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Status History
                          </span>
                        </div>
                        {request.requester && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <CircleIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="min-w-0 -mt-0.5">
                              <p className="text-sm font-semibold text-foreground">
                                {statusMap[request.status].label}
                              </p>
                              <p className="text-xs font-medium text-muted-foreground">
                                {formatLastUpdate(
                                  request.updated_at ?? request.created_at,
                                )}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                By {formatUserName(request.requester)}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
