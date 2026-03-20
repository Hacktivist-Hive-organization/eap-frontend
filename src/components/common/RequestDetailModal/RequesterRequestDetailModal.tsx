import { EraserIcon, RotateCcwIcon, SendHorizonalIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent } from '@/components/ui/modal';
import { useProcessRequest } from '@/features/dashboard/RequesterDashboard/hooks/useProcessRequest';
import { useReopenRequest } from '@/features/dashboard/RequesterDashboard/hooks/useReopenRequest';
import { useRequestById } from '@/features/dashboard/RequesterDashboard/hooks/useRequestById';
import { useRequestTracking } from '@/features/dashboard/RequesterDashboard/hooks/useRequestTracking';
import { useSubmitDraft } from '@/features/dashboard/RequesterDashboard/hooks/useSubmitDraft';
import { ErrorState, LoadingState, RequestDetailLayout } from './shared';

interface RequesterRequestDetailModalProps {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequesterRequestDetailModal({
  requestId,
  open,
  onOpenChange,
}: RequesterRequestDetailModalProps) {
  const { data: request, isLoading, isError } = useRequestById(requestId);
  const { data: tracking = [] } = useRequestTracking(requestId);
  const submitDraft = useSubmitDraft();
  const processRequest = useProcessRequest();
  const reopenRequest = useReopenRequest();

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

  const handleReopen = () => {
    reopenRequest.mutate(requestId, {
      onSuccess: () => {
        toast.success('Request reopened as draft');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to reopen request');
      },
    });
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
              (request.current_status === 'draft' ||
                request.current_status === 'submitted' ||
                request.current_status === 'cancelled') && (
                <div className="flex justify-end px-6 py-4">
                  {request.current_status === 'draft' && (
                    <Button
                      onClick={handleSubmitDraft}
                      disabled={submitDraft.isPending}
                    >
                      <SendHorizonalIcon />
                      {submitDraft.isPending
                        ? 'Submitting...'
                        : 'Submit Request'}
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
                  {request.current_status === 'cancelled' && (
                    <Button
                      variant="secondary"
                      onClick={handleReopen}
                      disabled={reopenRequest.isPending}
                    >
                      <RotateCcwIcon />
                      {reopenRequest.isPending
                        ? 'Reopening...'
                        : 'Reopen as Draft'}
                    </Button>
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
