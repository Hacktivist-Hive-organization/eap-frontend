import {
  CircleCheckIcon,
  CircleDotIcon,
  FileIcon,
  InboxIcon,
} from 'lucide-react';
import type { SidebarItem } from '@/components/common/Sidebar';

export type DashboardType = 'all' | 'active' | 'closed' | 'draft';

export const sidebarItems: SidebarItem[] = [
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
