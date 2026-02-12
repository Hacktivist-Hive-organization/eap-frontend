import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { NewRequestButton } from '@/components/common/NewRequestButton';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestDetailModal } from '@/components/common/RequestDetailModal';
import {
  RequestsTable,
  type Request as TableRequest,
} from '@/components/common/RequestsTable';
import {
  ComingSoonState,
  LoadingState,
} from '@/components/common/StateMessage';
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
  const { data: requests = [], isLoading } = useRequestsByStatus(
    dashboardTypeToStatuses[activeView],
  );
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRequestId = searchParams.get('requestId');

  const isImplemented = activeView === 'all' || activeView === 'draft';

  const handleRowClick = (request: TableRequest) => {
    setSearchParams({ requestId: String(request.id) });
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSearchParams({});
    }
  };

  return (
    <PageLayout sidebarItems={sidebarItems} activeKey={activeView}>
      {!isImplemented ? (
        <ComingSoonState />
      ) : (
        <div>
          <div className="flex items-center justify-between p-2">
            <span className="capitalize text-2xl font-bold">
              {activeView} Requests Dashboard
            </span>
            <NewRequestButton onClick={() => setNewRequestOpen(true)} />
          </div>
          {isLoading ? (
            <LoadingState />
          ) : (
            <RequestsTable requests={requests} onRowClick={handleRowClick} />
          )}
        </div>
      )}
      <RequestModal
        open={newRequestOpen}
        onOpenChange={setNewRequestOpen}
      />
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
