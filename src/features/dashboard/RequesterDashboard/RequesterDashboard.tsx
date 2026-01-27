import {
  CircleCheckIcon,
  CircleDotIcon,
  FileIcon,
  InboxIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  DashboardLayout,
  type Request,
  RequestsTable,
  type SidebarItem,
} from '@/components/common';
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
// TODO: Replace with actual data from API
const requests: Request[] = [
  {
    id: '1',
    title: 'New laptop request',
    type: 'Hardware',
    subtype: 'Laptop',
    status: 'Draft',
    lastUpdate: '2024-01-15',
    priority: 'High',
  },
  {
    id: '2',
    title: 'Software license renewal',
    type: 'Software',
    subtype: 'License',
    status: 'Draft',
    lastUpdate: '2026-01-14',
    priority: 'Medium',
  },
  {
    id: '3',
    title: 'Office supplies',
    type: 'Supplies',
    subtype: 'General',
    status: 'Draft',
    lastUpdate: '2026-01-26T10:00:00Z',
    priority: 'Low',
  },
  {
    id: '4',
    title: 'Access card replacement',
    type: 'Security',
    subtype: 'Access',
    status: 'Draft',
    lastUpdate: '2024-01-12',
    priority: 'High',
    assignee: 'Joe Doe',
  },
];

export function RequesterDashboard() {
  const { view } = useParams<{ view: DashboardType }>();
  const activeView = (view as DashboardType) || 'draft';

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey={activeView}
    >
      {activeView !== 'draft' && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Dashboard view coming soon</p>
        </div>
      )}

      {activeView === 'draft' && (
        <div>
          <span className="capitalize text-2xl font-bold p-4">
            {activeView} Requests Dashboard
          </span>
          <RequestsTable requests={requests} />
        </div>
      )}
    </DashboardLayout>
  );
}
