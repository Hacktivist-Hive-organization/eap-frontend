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
import { useAdminRequests } from './hooks';
import {
  type AdminDashboardType,
  adminDashboardTypeToStatuses,
  adminSidebarItems,
} from './utils/types';

export function AdminDashboard() {
  const { view = 'all' } = useParams<{ view: AdminDashboardType }>();
  const activeView = view in adminDashboardTypeToStatuses ? view : 'all';

  const {
    data: allRequests = [],
    isLoading,
    isError,
    refetch,
  } = useAdminRequests();
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
      <div>
        <div className="flex items-center justify-between p-2">
          <span className="capitalize text-2xl font-bold">
            {activeView} Requests Dashboard
          </span>
        </div>
        {activeView !== 'all' ? (
          <ComingSoonState />
        ) : isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <RequestsTable requests={allRequests} onRowClick={handleRowClick} />
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
