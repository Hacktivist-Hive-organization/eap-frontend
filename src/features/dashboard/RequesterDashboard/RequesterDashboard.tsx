import { useParams } from 'react-router-dom';
import { NewRequestButton } from '@/components/common/NewRequestButton';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestsTable } from '@/components/common/RequestsTable';
import {
  ComingSoonState,
  LoadingState,
} from '@/components/common/StateMessage';
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

  const isImplemented = activeView === 'all' || activeView === 'draft';

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
            <NewRequestButton />
          </div>
          {isLoading ? <LoadingState /> : <RequestsTable requests={requests} />}
        </div>
      )}
    </PageLayout>
  );
}
