import { ClockIcon, HistoryIcon, InboxIcon } from 'lucide-react';
import type { SidebarItem } from '@/components/common/Sidebar';
import type { Status } from '@/types/Status';

export type ApproverDashboardType = 'all' | 'pending' | 'history';

export const approverDashboardTypeToStatuses: Record<
  ApproverDashboardType,
  Status[]
> = {
  all: [],
  pending: ['submitted', 'under_review'],
  history: ['approved', 'rejected', 'completed'],
};

export const approverSidebarItems: SidebarItem[] = [
  {
    key: 'all',
    label: 'All',
    icon: <InboxIcon className="h-5 w-5" />,
    path: '/dashboard/all',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: <ClockIcon className="h-5 w-5" />,
    path: '/dashboard/pending',
  },
  {
    key: 'history',
    label: 'History',
    icon: <HistoryIcon className="h-5 w-5" />,
    path: '/dashboard/history',
  },
];
