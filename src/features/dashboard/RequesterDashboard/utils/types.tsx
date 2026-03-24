import {
  CircleCheckIcon,
  CircleDotIcon,
  FileIcon,
  InboxIcon,
} from 'lucide-react';
import type { SidebarItem } from '@/components/common/Sidebar';
import type { Status } from '@/types/Status';

export type DashboardType = 'all' | 'active' | 'closed' | 'draft';

export const dashboardTypeToStatuses: Record<DashboardType, Status[]> = {
  all: [],
  active: ['submitted', 'in_progress', 'approved'],
  closed: ['completed', 'rejected', 'cancelled'],
  draft: ['draft'],
};

export const sidebarItems: SidebarItem[] = [
  {
    key: 'all',
    label: 'All',
    icon: <InboxIcon className="h-5 w-5" />,
    path: '/dashboard/all',
    group: 'Requests',
  },
  {
    key: 'active',
    label: 'Active',
    icon: <CircleDotIcon className="h-5 w-5" />,
    path: '/dashboard/active',
    group: 'Requests',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: <CircleCheckIcon className="h-5 w-5" />,
    path: '/dashboard/closed',
    group: 'Requests',
  },
  {
    key: 'draft',
    label: 'Draft',
    icon: <FileIcon className="h-5 w-5" />,
    path: '/dashboard/draft',
    group: 'Requests',
  },
];
