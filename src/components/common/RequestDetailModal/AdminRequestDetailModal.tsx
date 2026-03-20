import { CheckCircle2Icon, PlayCircleIcon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import {
  useAdminProcessRequest,
  useAdminRequestById,
} from '@/features/dashboard/AdminDashboard/hooks';
import { useRequestTracking } from '@/features/dashboard/RequesterDashboard/hooks/useRequestTracking';
import { ErrorState, LoadingState, RequestDetailLayout } from './shared';

interface AdminRequestDetailModalProps {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminRequestDetailModal({
  requestId,
  open,
  onOpenChange,
}: AdminRequestDetailModalProps) {
  const { data: request, isLoading, isError } = useAdminRequestById(requestId);
  const { data: tracking = [] } = useRequestTracking(requestId);
  const processAdminRequest = useAdminProcessRequest();
  const [pendingAction, setPendingAction] = useState<
    'completed' | 'rejected' | null
  >(null);
  const [comment, setComment] = useState('');

  const handleTakeIntoProgress = () => {
    processAdminRequest.mutate(
      { id: requestId, status: 'in_progress' },
      {
        onSuccess: () => {
          toast.success('Request taken into progress');
        },
        onError: () => {
          toast.error('Failed to take request into progress');
        },
      },
    );
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;
    processAdminRequest.mutate(
      {
        id: requestId,
        status: pendingAction,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            pendingAction === 'completed'
              ? 'Request completed'
              : 'Request rejected',
          );
        },
        onError: () => {
          toast.error(
            pendingAction === 'completed'
              ? 'Failed to complete request'
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

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl p-0">
        {isLoading ? (
          <LoadingState />
        ) : isError || !request ? (
          <ErrorState />
        ) : (
          <RequestDetailLayout
            request={request}
            tracking={tracking}
            actions={
              request.current_status === 'approved' ? (
                <div className="flex justify-end px-6 py-4">
                  <Button
                    onClick={handleTakeIntoProgress}
                    disabled={processAdminRequest.isPending}
                  >
                    <PlayCircleIcon />
                    {processAdminRequest.isPending
                      ? 'Processing...'
                      : 'Take into Progress'}
                  </Button>
                </div>
              ) : request.current_status === 'in_progress' ? (
                <div className="flex flex-col gap-3 px-6 py-4">
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
                          disabled={processAdminRequest.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={
                            pendingAction === 'rejected'
                              ? 'destructive'
                              : 'default'
                          }
                          onClick={handleConfirmAction}
                          disabled={
                            processAdminRequest.isPending ||
                            (pendingAction === 'rejected' && !comment.trim())
                          }
                        >
                          {pendingAction === 'rejected' ? (
                            <XCircleIcon />
                          ) : (
                            <CheckCircle2Icon />
                          )}
                          {processAdminRequest.isPending
                            ? 'Processing...'
                            : pendingAction === 'rejected'
                              ? 'Confirm Reject'
                              : 'Confirm Complete'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setPendingAction('rejected')}
                        disabled={processAdminRequest.isPending}
                      >
                        <XCircleIcon />
                        Reject
                      </Button>
                      <Button
                        onClick={() => setPendingAction('completed')}
                        disabled={processAdminRequest.isPending}
                      >
                        <CheckCircle2Icon />
                        Complete
                      </Button>
                    </div>
                  )}
                </div>
              ) : null
            }
          />
        )}
      </ModalContent>
    </Modal>
  );
}
