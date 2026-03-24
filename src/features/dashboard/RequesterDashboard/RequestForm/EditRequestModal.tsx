import { Modal, ModalContent } from '@/components/ui/modal';
import type { RequestDetailResponse } from '@/services/auth/types';
import { useRequestTypes } from './hooks/useRequestTypes';
import { RequestForm } from './RequestForm';
import type { RequestFormData } from './utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RequestDetailResponse;
};

export const EditRequestModal = ({ open, onOpenChange, request }: Props) => {
  useRequestTypes();

  const initialValues: RequestFormData = {
    type_id: request.type.id,
    subtype_id: request.subtype.id,
    title: request.title,
    description: request.description ?? '',
    justification: request.business_justification ?? '',
    priority: request.priority,
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl overflow-y-auto max-h-[calc(100dvh-4rem)]">
        <RequestForm
          requestId={request.id}
          initialValues={initialValues}
          onSuccess={() => onOpenChange(false)}
        />
      </ModalContent>
    </Modal>
  );
};
