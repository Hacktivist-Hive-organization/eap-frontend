import { Modal, ModalContent } from '@/components/ui/modal';
import { useRequestTypes } from './hooks/useRequestTypes';
import { RequestForm } from './RequestForm';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RequestModal = ({ open, onOpenChange }: Props) => {
  // Prefetch request types while the modal is closed so
  // the form renders instantly when the user opens it.
  useRequestTypes();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-5xl overflow-y-auto max-h-[calc(100dvh-4rem)]">
        <RequestForm onSuccess={() => onOpenChange(false)} />
      </ModalContent>
    </Modal>
  );
};
