import type { PropsWithChildren } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { DashboardType } from '@/features/dashboard/RequesterDashboard/utils/types';
import { Logo } from './Logo';
import { LogoutButton } from './LogoutButton';
import { Sidebar, type SidebarItem } from './Sidebar';

interface Props {
  sidebarItems: SidebarItem[];
  activeKey: DashboardType;
}

export function PageLayout({
  children,
  sidebarItems,
  activeKey,
}: PropsWithChildren<Props>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar items={sidebarItems} activeKey={activeKey} />
        <SidebarInset>
          <header className="sticky top-0 z-10 bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-4">
                <Logo className="h-6 w-auto" />
              </div>
              <div className="flex items-center gap-4">
                <LogoutButton />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
