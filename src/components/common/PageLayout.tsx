import type { PropsWithChildren } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Logo } from './Logo';
import { NavUser } from './NavUser';
import { Sidebar, type SidebarItem } from './Sidebar';

interface Props {
  sidebarItems: SidebarItem[];
  activeKey: string;
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
          <header className="sticky top-0 bg-white border-b">
            <div className="flex items-center justify-between pl-6 pr-13 py-2.5">
              <div className="flex items-center gap-4">
                <Logo className="h-6 w-auto" />
              </div>
              <NavUser />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
