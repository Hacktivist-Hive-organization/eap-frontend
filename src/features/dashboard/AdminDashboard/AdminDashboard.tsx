import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestsTable } from '@/components/common/RequestsTable';
import {
  ComingSoonState,
  LoadingState,
} from '@/components/common/StateMessage';
import { useAdminRequestsByStatus } from './hooks';
import {
  type AdminDashboardType,
  adminDashboardTypeToStatuses,
  adminSidebarItems,
} from './utils/types';

export function AdminDashboard() {
  const { view = 'backlog' } = useParams<{ view: AdminDashboardType }>();
  const activeView = view in adminDashboardTypeToStatuses ? view : 'backlog';
  const { data: requests = [], isLoading } = useAdminRequestsByStatus(
    adminDashboardTypeToStatuses[activeView],
  );

  const isImplemented = false;

  return (
    <PageLayout sidebarItems={adminSidebarItems} activeKey={activeView}>
      {!isImplemented ? (
        <ComingSoonState />
      ) : (
        <div>
          <div className="flex items-center justify-between p-2">
            <span className="capitalize text-2xl font-bold">
              {activeView} Requests
            </span>
          </div>
          {isLoading ? <LoadingState /> : <RequestsTable requests={requests} />}
        </div>
      )}
    </PageLayout>
  );
}
