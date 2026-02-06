import {
  AdminDashboard,
  ApproverDashboard,
  RequesterDashboard,
} from '@/features/dashboard';
import { useAppSelector } from '@/hooks/useRedux';

export function DashboardPage() {
  const role = useAppSelector((state) => state.userState.user?.role);

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'approver':
      return <ApproverDashboard />;
    default:
      return <RequesterDashboard />;
  }
}
