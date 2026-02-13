import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { ComingSoonState } from '@/components/common/StateMessage';
import {
  type AdminDashboardType,
  adminDashboardTypeToStatuses,
  adminSidebarItems,
} from './utils/types';

export function AdminDashboard() {
  const { view = 'backlog' } = useParams<{ view: AdminDashboardType }>();
  const activeView = view in adminDashboardTypeToStatuses ? view : 'backlog';

  return (
    <PageLayout sidebarItems={adminSidebarItems} activeKey={activeView}>
      <ComingSoonState />
    </PageLayout>
  );
}
