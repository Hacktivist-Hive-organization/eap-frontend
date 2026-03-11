import { useParams, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestDetailModal } from '@/components/common/RequestDetailModal';
import {
  RequestsTable,
  type Request as TableRequest,
} from '@/components/common/RequestsTable';
import {
  ComingSoonState,
  ErrorState,
  LoadingState,
} from '@/components/common/StateMessage';
import { useAdminRequests, useAllUsers } from './hooks';
import { UsersTable } from './UsersTable';
import {
  type AdminDashboardType,
  adminDashboardTypeToStatuses,
  adminSidebarItems,
} from './utils/types';

export function AdminDashboard() {
  const { view = 'all-system-requests' } = useParams<{
    view: AdminDashboardType;
  }>();
  const activeView =
    view === 'users' || view in adminDashboardTypeToStatuses
      ? view
      : 'all-system-requests';

  const {
    data: allRequests = [],
    isLoading,
    isError,
    refetch,
  } = useAdminRequests();

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useAllUsers();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRequestId = searchParams.get('requestId');

  const handleRowClick = (request: TableRequest) => {
    setSearchParams({ requestId: String(request.id) });
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSearchParams({});
    }
  };

  return (
    <PageLayout sidebarItems={adminSidebarItems} activeKey={activeView}>
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
      ) : activeView === 'all-system-requests' ? (
        <div>
          <div className="flex items-center justify-between p-2">
            <span className="capitalize text-2xl font-bold">
              All Requests Dashboard
            </span>
          </div>
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <RequestsTable requests={allRequests} onRowClick={handleRowClick} />
          )}
        </div>
      ) : (
        <ComingSoonState />
      )}
      {selectedRequestId && (
        <RequestDetailModal
          requestId={Number(selectedRequestId)}
          open={true}
          onOpenChange={handleModalClose}
        />
      )}
    </PageLayout>
  );
}
