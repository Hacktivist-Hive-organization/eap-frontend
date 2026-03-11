import { Modal, ModalContent } from '@/components/ui/modal';
import { useRequestById } from '@/features/dashboard/RequesterDashboard/hooks/useRequestById';
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
  const { data: request, isLoading, isError } = useRequestById(requestId);
  const { data: tracking = [] } = useRequestTracking(requestId);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl p-0">
        {isLoading ? (
          <LoadingState />
        ) : isError || !request ? (
          <ErrorState />
        ) : (
          <RequestDetailLayout request={request} tracking={tracking} />
        )}
      </ModalContent>
    </Modal>
  );
}
