import { useAppSelector } from '@/hooks/useRedux';
import { AdminRequestDetailModal } from './AdminRequestDetailModal';
import { ApproverRequestDetailModal } from './ApproverRequestDetailModal';
import { RequesterRequestDetailModal } from './RequesterRequestDetailModal';

interface RequestDetailModalProps {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailModal(props: RequestDetailModalProps) {
  const role = useAppSelector((state) => state.userState.user?.role);

  if (role === 'approver') {
    return <ApproverRequestDetailModal {...props} />;
  }

  if (role === 'admin') {
    return <AdminRequestDetailModal {...props} />;
  }

  return <RequesterRequestDetailModal {...props} />;
}
