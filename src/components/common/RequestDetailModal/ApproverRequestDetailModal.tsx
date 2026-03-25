import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { useApproverRequestById } from '@/features/dashboard/ApproverDashboard/hooks/useApproverRequestById';
import { useProcessRequest } from '@/features/dashboard/RequesterDashboard/hooks/useProcessRequest';
import { useRequestTracking } from '@/features/dashboard/RequesterDashboard/hooks/useRequestTracking';
import { ErrorState, LoadingState, RequestDetailLayout } from './shared';

interface ApproverRequestDetailModalProps {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproverRequestDetailModal({
  requestId,
  open,
  onOpenChange,
}: ApproverRequestDetailModalProps) {
  const {
    data: request,
    isLoading,
    isError,
  } = useApproverRequestById(requestId);
  const { data: tracking = [] } = useRequestTracking(requestId);
  const processRequest = useProcessRequest();
  const [pendingAction, setPendingAction] = useState<
    'approved' | 'rejected' | null
  >(null);
  const [comment, setComment] = useState('');

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

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl p-0 overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : isError || !request ? (
          <ErrorState />
        ) : (
          <RequestDetailLayout
            request={request}
            tracking={tracking}
            actions={
              request.current_status === 'submitted' && (
                <div className="flex flex-col gap-3 px-6 py-4">
                  {pendingAction ? (
                    <>
                      <Textarea
                        placeholder={
                          pendingAction === 'rejected'
                            ? 'Comment is required (min. 5 characters)'
                            : 'Add a comment (optional, min. 5 characters)'
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
                            pendingAction === 'rejected'
                              ? 'destructive'
                              : 'default'
                          }
                          onClick={handleConfirmAction}
                          disabled={
                            processRequest.isPending ||
                            (pendingAction === 'rejected' &&
                              comment.trim().length < 5) ||
                            (pendingAction === 'approved' &&
                              comment.trim().length > 0 &&
                              comment.trim().length < 5)
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
              )
            }
          />
        )}
      </ModalContent>
    </Modal>
  );
}
