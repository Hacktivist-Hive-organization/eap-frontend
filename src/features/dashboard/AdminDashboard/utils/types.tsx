import {
  CheckCircleIcon,
  InboxIcon,
  ListIcon,
  LoaderIcon,
  UsersIcon,
} from 'lucide-react';
import type { SidebarItem } from '@/components/common/Sidebar';
import type { Status } from '@/types/Status';

export type AdminDashboardType =
  | 'backlog'
  | 'in-progress'
  | 'closed'
  | 'all'
  | 'users';

export const adminDashboardTypeToStatuses: Record<
  Exclude<AdminDashboardType, 'users'>,
  Status[]
> = {
  'all': [],
  backlog: ['approved'],
  'in-progress': ['in_progress'],
  closed: ['completed', 'rejected'],
};

export const adminSidebarItems: SidebarItem[] = [
  {
    key: 'all',
    label: 'All System Requests',
    icon: <ListIcon className="h-5 w-5" />,
    path: '/dashboard/all',
  },
  {
    key: 'backlog',
    label: 'Backlog',
    icon: <InboxIcon className="h-5 w-5" />,
    path: '/dashboard/backlog',
    group: 'Requests',
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    icon: <LoaderIcon className="h-5 w-5" />,
    path: '/dashboard/in-progress',
    group: 'Requests',
  },
  {
    key: 'closed',
    label: 'Closed',
    icon: <CheckCircleIcon className="h-5 w-5" />,
    path: '/dashboard/closed',
    group: 'Requests',
  },
  {
    key: 'users',
    label: 'All Users',
    icon: <UsersIcon className="h-5 w-5" />,
    path: '/dashboard/users',
    group: 'Administration',
  },
];
