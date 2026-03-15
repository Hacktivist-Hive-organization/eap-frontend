import { Navigate, useParams } from 'react-router-dom';
import {
  AdminDashboard,
  ApproverDashboard,
  RequesterDashboard,
} from '@/features/dashboard';
import { useAppSelector } from '@/hooks/useRedux';
import type { Role } from '@/types/Role';

const ROLE_VIEWS: Record<Role, { views: string[]; default: string }> = {
  requester: { views: ['all', 'active', 'closed', 'draft'], default: 'all' },
  approver: { views: ['all', 'pending', 'history'], default: 'all' },
  admin: {
    views: ['all', 'backlog', 'in-progress', 'closed', 'users'],
    default: 'all',
  },
};

export function DashboardPage() {
  const role = useAppSelector((state) => state.userState.user?.role);
  const { view } = useParams<{ view: string }>();

  if (!role) return null;

  const config = ROLE_VIEWS[role];

  if (!view || !config.views.includes(view)) {
    return <Navigate to={`/dashboard/${config.default}`} replace />;
  }

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'approver':
      return <ApproverDashboard />;
    default:
      return <RequesterDashboard />;
  }
}
