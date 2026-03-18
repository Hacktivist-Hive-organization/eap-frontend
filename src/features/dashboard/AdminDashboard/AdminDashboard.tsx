import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AdminEditUserModal } from '@/components/common/AdminEditUserModal';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestDetailModal } from '@/components/common/RequestDetailModal';
import {
  RequestsTable,
  type Request as TableRequest,
} from '@/components/common/RequestsTable';
import { ErrorState, LoadingState } from '@/components/common/StateMessage';
import { useAppSelector } from '@/hooks/useRedux';
import type { UserResponse } from '@/services/api/requests/user';
import { useAdminRequestsByStatus, useAllUsers } from './hooks';
import { UsersTable } from './UsersTable';
import {
  type AdminDashboardType,
  adminDashboardTypeToStatuses,
  adminSidebarItems,
} from './utils/types';

const viewLabels: Record<Exclude<AdminDashboardType, 'users'>, string> = {
  all: 'All Requests Dashboard',
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  closed: 'Closed',
};

export function AdminDashboard() {
  const { view = 'all' } = useParams<{
    view: AdminDashboardType;
  }>();
  const activeView =
    view === 'users' || view in adminDashboardTypeToStatuses ? view : 'all';

  const {
    data: allRequests = [],
    isLoading,
    isError,
    refetch,
  } = useAdminRequestsByStatus([]);

  const currentUserId = useAppSelector((state) => state.userState.user?.id);

  const requests = useMemo(() => {
    if (activeView === 'users') return [];
    const statuses = adminDashboardTypeToStatuses[activeView];
    if (statuses.length === 0) return allRequests;
    const filtered = allRequests.filter((r) => statuses.includes(r.status));
    if (activeView === 'closed') {
      return filtered.filter((r) => r.assigneeId === currentUserId);
    }
    return filtered;
  }, [allRequests, activeView, currentUserId]);

  const {
    data: allUsers = [],
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useAllUsers();

  const users = useMemo(
    () => allUsers.filter((u) => u.id !== currentUserId),
    [allUsers, currentUserId],
  );

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRequestId = searchParams.get('requestId');

  const counts = useMemo<
    Record<Exclude<AdminDashboardType, 'users'>, number>
  >(() => {
    const result = {
      all: allRequests.length,
      backlog: 0,
      'in-progress': 0,
      closed: 0,
    };
    for (const r of allRequests) {
      if (adminDashboardTypeToStatuses.backlog.includes(r.status))
        result.backlog++;
      else if (adminDashboardTypeToStatuses['in-progress'].includes(r.status))
        result['in-progress']++;
      else if (
        adminDashboardTypeToStatuses.closed.includes(r.status) &&
        r.assigneeId === currentUserId
      )
        result.closed++;
    }
    return result;
  }, [allRequests, currentUserId]);

  const sidebarItemsWithBadges = useMemo(
    () =>
      adminSidebarItems.map((item) => ({
        ...item,
        badge:
          item.key in counts
            ? counts[item.key as Exclude<AdminDashboardType, 'users'>]
            : undefined,
      })),
    [counts],
  );

  const handleRowClick = (request: TableRequest) => {
    setSearchParams({ requestId: String(request.id) });
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSearchParams({});
    }
  };

  return (
    <PageLayout sidebarItems={sidebarItemsWithBadges} activeKey={activeView}>
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
            <UsersTable
              users={users}
              onRowClick={(user) => setSelectedUser(user)}
            />
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between p-2">
            <span className="capitalize text-2xl font-bold">
              {viewLabels[activeView]}
            </span>
          </div>
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <RequestsTable requests={requests} onRowClick={handleRowClick} />
          )}
        </div>
      )}
      {selectedRequestId && (
        <RequestDetailModal
          requestId={Number(selectedRequestId)}
          open={true}
          onOpenChange={handleModalClose}
        />
      )}
      <AdminEditUserModal
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </PageLayout>
  );
}
