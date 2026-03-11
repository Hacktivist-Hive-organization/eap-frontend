import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import {
  ComingSoonState,
  ErrorState,
  LoadingState,
} from '@/components/common/StateMessage';
import { useAllUsers } from './hooks';
import { UsersTable } from './UsersTable';
import {
  type AdminDashboardType,
  adminDashboardTypeToStatuses,
  adminSidebarItems,
} from './utils/types';

export function AdminDashboard() {
  const { view = 'backlog' } = useParams<{ view: AdminDashboardType }>();
  const activeView =
    view === 'users' || view in adminDashboardTypeToStatuses ? view : 'backlog';

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useAllUsers();

  return (
    <PageLayout
      sidebarItems={adminSidebarItems}
      activeKey={activeView}
      showSearch={false}
    >
      {activeView === 'users' ? (
        <div>
          <div className="flex items-center justify-between p-2">
            <span className="capitalize text-2xl font-bold">All Users</span>
          </div>
          {usersLoading ? (
            <LoadingState />
          ) : usersError ? (
            <ErrorState onRetry={() => refetchUsers()} />
          ) : (
            <UsersTable users={users} />
          )}
        </div>
      ) : (
        <ComingSoonState />
      )}
    </PageLayout>
  );
}
