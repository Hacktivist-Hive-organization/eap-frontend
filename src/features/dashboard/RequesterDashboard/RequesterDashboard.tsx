import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { NewRequestButton } from '@/components/common/NewRequestButton';
import { PageLayout } from '@/components/common/PageLayout';
import {
  ComingSoonState,
  LoadingState,
} from '@/components/common/StateMessage';
import { RequestModal } from '@/features/RequestForm/RequestModal';
import { useRequestsByStatus } from './hooks';
import { RequestDetailModal } from './RequestDetailModal';
import { type Request, RequestsTable } from './RequestsTable';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRequestId = searchParams.get('requestId');

  const isImplemented = activeView === 'all' || activeView === 'draft';
  const [showForm, setShowForm] = useState(false);

  const handleRowClick = (request: Request) => {
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
            <NewRequestButton onClick={() => setShowForm(true)} />
          </div>
          {isLoading ? (
            <LoadingState />
          ) : (
            <RequestsTable requests={requests} onRowClick={handleRowClick} />
          )}
          <RequestModal open={showForm} onClose={() => setShowForm(false)} />
        </div>
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
