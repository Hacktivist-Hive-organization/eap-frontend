import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { NewRequestButton } from '@/components/common/NewRequestButton';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestDetailModal } from '@/components/common/RequestDetailModal';
import {
  RequestsTable,
  type Request as TableRequest,
} from '@/components/common/RequestsTable';
import { ErrorState, LoadingState } from '@/components/common/StateMessage';
import { RequestModal } from '@/features/dashboard/RequesterDashboard/RequestForm/RequestModal';
import { useRequestsByStatus } from './hooks';
import {
  type DashboardType,
  dashboardTypeToStatuses,
  sidebarItems,
} from './utils/types';

export function RequesterDashboard() {
  const { view = 'all' } = useParams<{ view: DashboardType }>();
  const activeView = view in dashboardTypeToStatuses ? view : 'all';
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useRequestsByStatus(dashboardTypeToStatuses[activeView]);
  const { data: allRequests = [] } = useRequestsByStatus([]);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRequestId = searchParams.get('requestId');

  const counts: Record<DashboardType, number> = {
    all: allRequests.length,
    active: allRequests.filter((r) =>
      dashboardTypeToStatuses.active.includes(r.status),
    ).length,
    closed: allRequests.filter((r) =>
      dashboardTypeToStatuses.closed.includes(r.status),
    ).length,
    draft: allRequests.filter((r) =>
      dashboardTypeToStatuses.draft.includes(r.status),
    ).length,
  };

  const sidebarItemsWithBadges = sidebarItems.map((item) => ({
    ...item,
    badge: counts[item.key as DashboardType],
  }));

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
      <div>
        <div className="flex items-center justify-between p-2">
          <span className="capitalize text-2xl font-bold">
            {activeView} Requests Dashboard
          </span>
          <NewRequestButton onClick={() => setNewRequestOpen(true)} />
        </div>
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <RequestsTable requests={requests} onRowClick={handleRowClick} />
        )}
      </div>
      <RequestModal open={newRequestOpen} onOpenChange={setNewRequestOpen} />
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
