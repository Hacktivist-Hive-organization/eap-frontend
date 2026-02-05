import { X } from 'lucide-react';
import { RequestForm } from './RequestForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const RequestModal = ({ open, onClose }: Props) => {
  if (!open) return null; // modal hidden if not open

  return (
    // Overlay + modal box
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-5xl max-h-[97vh] overflow-y-auto relative p-6"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* The form */}
        <RequestForm onCancel={onClose} onSuccess={onClose} />
      </div>
    </div>
  );
};
