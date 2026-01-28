import { PlusIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestsTable } from '@/components/common/RequestsTable';
import { Button } from '@/components/ui/button';
import type { Status } from '@/types/Status';
import { useDraftRequests as useRequestsByStatus } from './hooks';
import { type DashboardType, sidebarItems } from './utils/types';

export function RequesterDashboard() {
  const { view } = useParams<{ view: DashboardType }>();
  const activeView = (view as DashboardType) || 'draft';
  const { data: requests = [], isLoading } = useRequestsByStatus(
    activeView as Status,
  );

  return (
    <PageLayout sidebarItems={sidebarItems} activeKey={activeView}>
      {activeView !== 'draft' && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Dashboard view coming soon</p>
        </div>
      )}

      {activeView === 'draft' && (
        <div>
          <div className="flex items-center justify-between p-2">
            <span className="capitalize text-2xl font-bold">
              {activeView} Requests Dashboard
            </span>
            <Button asChild>
              <Link to="/request/new">
                <PlusIcon className="h-4 w-4" />
                New Request
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <RequestsTable requests={requests} />
          )}
        </div>
      )}
    </PageLayout>
  );
}
