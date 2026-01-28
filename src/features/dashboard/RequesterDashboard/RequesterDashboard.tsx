import {
  CircleCheckIcon,
  CircleDotIcon,
  FileIcon,
  InboxIcon,
  PlusIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { RequestsTable } from '@/components/common/RequestsTable';
import type { SidebarItem } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { useDraftRequests } from './hooks';
import type { DashboardType } from './utils/types';

const sidebarItems: SidebarItem[] = [
  {
    key: 'all',
    label: 'All',
    icon: <InboxIcon className="h-5 w-5" />,
    path: '/dashboard/all',
  },
  {
    key: 'active',
    label: 'Active',
    icon: <CircleDotIcon className="h-5 w-5" />,
    path: '/dashboard/active',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: <CircleCheckIcon className="h-5 w-5" />,
    path: '/dashboard/closed',
  },
  {
    key: 'draft',
    label: 'Draft',
    icon: <FileIcon className="h-5 w-5" />,
    path: '/dashboard/draft',
  },
];

export function RequesterDashboard() {
  const { view } = useParams<{ view: DashboardType }>();
  const activeView = (view as DashboardType) || 'draft';
  const { data: draftRequests = [], isLoading } = useDraftRequests('draft');

  return (
    <PageLayout sidebarItems={sidebarItems} activeKey={activeView}>
      {activeView !== 'draft' && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Dashboard view coming soon</p>
        </div>
      )}

      {activeView === 'draft' && (
        <div>
          <div className="flex items-center justify-between p-4">
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
            <RequestsTable requests={draftRequests} />
          )}
        </div>
      )}
    </PageLayout>
  );
}
