import { CheckCircleIcon, InboxIcon, LoaderIcon } from 'lucide-react';
import type { SidebarItem } from '@/components/common/Sidebar';
import type { Status } from '@/types/Status';

export type AdminDashboardType = 'backlog' | 'in-progress' | 'closed';

export const adminDashboardTypeToStatuses: Record<
  AdminDashboardType,
  Status[]
> = {
  backlog: ['approved'],
  'in-progress': ['in_progress'],
  closed: ['completed', 'rejected'],
};

export const adminSidebarItems: SidebarItem[] = [
  {
    key: 'backlog',
    label: 'Backlog',
    icon: <InboxIcon className="h-5 w-5" />,
    path: '/dashboard/backlog',
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    icon: <LoaderIcon className="h-5 w-5" />,
    path: '/dashboard/in-progress',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: <CheckCircleIcon className="h-5 w-5" />,
    path: '/dashboard/closed',
  },
];
