import { useParams, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestDetailModal } from '@/components/common/RequestDetailModal';
import {
  RequestsTable,
  type Request as TableRequest,
} from '@/components/common/RequestsTable';
import { ErrorState, LoadingState } from '@/components/common/StateMessage';
import { useApproverRequestsByStatus } from './hooks';
import {
  type ApproverDashboardType,
  approverDashboardTypeToStatuses,
  approverSidebarItems,
} from './utils/types';

export function ApproverDashboard() {
  const { view = 'all' } = useParams<{ view: ApproverDashboardType }>();
  const activeView = view in approverDashboardTypeToStatuses ? view : 'all';
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useApproverRequestsByStatus(approverDashboardTypeToStatuses[activeView]);
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
    <PageLayout sidebarItems={approverSidebarItems} activeKey={activeView}>
      <div>
        <div className="flex items-center justify-between p-2">
          <span className="capitalize text-2xl font-bold">
            {activeView} Requests Dashboard
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
