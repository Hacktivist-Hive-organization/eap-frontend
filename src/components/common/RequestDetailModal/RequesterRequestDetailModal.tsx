import {
  EraserIcon,
  PencilIcon,
  RotateCcwIcon,
  SendHorizonalIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent } from '@/components/ui/modal';
import { useDeleteDraft } from '@/features/dashboard/RequesterDashboard/hooks/useDeleteDraft';
import { useProcessRequest } from '@/features/dashboard/RequesterDashboard/hooks/useProcessRequest';
import { useReopenRequest } from '@/features/dashboard/RequesterDashboard/hooks/useReopenRequest';
import { useRequestById } from '@/features/dashboard/RequesterDashboard/hooks/useRequestById';
import { useRequestTracking } from '@/features/dashboard/RequesterDashboard/hooks/useRequestTracking';
import { useSubmitDraft } from '@/features/dashboard/RequesterDashboard/hooks/useSubmitDraft';
import { EditRequestModal } from '@/features/dashboard/RequesterDashboard/RequestForm/EditRequestModal';
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
  const deleteDraft = useDeleteDraft();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSubmitDraft = () => {
    submitDraft.mutate(requestId, {
      onSuccess: () => {
        toast.success('Request submitted successfully');
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
      },
      onError: () => {
        toast.error('Failed to reopen request');
      },
    });
  };

  const handleDelete = () => {
    deleteDraft.mutate(requestId, {
      onSuccess: () => {
        toast.success('Draft deleted');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to delete draft');
      },
    });
  };

  return (
    <>
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
                (request.current_status === 'draft' ||
                  request.current_status === 'submitted' ||
                  request.current_status === 'cancelled') && (
                  <div className="flex justify-end gap-2 px-6 py-4">
                    {request.current_status === 'draft' && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={deleteDraft.isPending}
                            >
                              <Trash2Icon />
                              {deleteDraft.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete draft?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The draft request
                                will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="secondary"
                          onClick={() => setIsEditOpen(true)}
                        >
                          <PencilIcon />
                          Edit
                        </Button>

                        <Button
                          onClick={handleSubmitDraft}
                          disabled={submitDraft.isPending}
                        >
                          <SendHorizonalIcon />
                          {submitDraft.isPending
                            ? 'Submitting...'
                            : 'Submit Request'}
                        </Button>
                      </>
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

      {request?.current_status === 'draft' && (
        <EditRequestModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          request={request}
        />
      )}
    </>
  );
}
