import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestsTable } from '@/components/common/RequestsTable';
import {
  ComingSoonState,
  LoadingState,
} from '@/components/common/StateMessage';
import { useApproverRequestsByStatus } from './hooks';
import {
  type ApproverDashboardType,
  approverDashboardTypeToStatuses,
  approverSidebarItems,
} from './utils/types';

export function ApproverDashboard() {
  const { view = 'all' } = useParams<{ view: ApproverDashboardType }>();
  const activeView = view in approverDashboardTypeToStatuses ? view : 'all';
  const { data: requests = [], isLoading } = useApproverRequestsByStatus(
    approverDashboardTypeToStatuses[activeView],
  );

  const isImplemented = false;

  return (
    <PageLayout sidebarItems={approverSidebarItems} activeKey={activeView}>
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
