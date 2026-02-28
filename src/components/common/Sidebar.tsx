import { LayoutDashboardIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export interface SidebarItem {
  key: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  activeKey: string;
}

export function Sidebar({ items, activeKey }: SidebarProps) {
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <LayoutDashboardIcon className="w-5 h-5 text-slate-600" />
            <span className="text-lg font-semibold tracking-tight text-slate-800">
              Dashboard
            </span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                asChild
                isActive={activeKey === item.key}
                tooltip={item.label}
                className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto text-xs font-semibold tabular-nums bg-muted text-muted-foreground rounded-full min-w-5 h-5 flex items-center justify-center px-1 group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
