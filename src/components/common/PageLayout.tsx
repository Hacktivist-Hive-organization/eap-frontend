import { Search } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Logo } from './Logo';
import { NavUser } from './NavUser';
import { Sidebar, type SidebarItem } from './Sidebar';

interface Props {
  sidebarItems: SidebarItem[];
  activeKey: string;
  showSearch?: boolean;
}

export function PageLayout({
  children,
  sidebarItems,
  activeKey,
  showSearch = true,
}: PropsWithChildren<Props>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const handleSearch = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('q', value);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar items={sidebarItems} activeKey={activeKey} />
        <SidebarInset>
          <header className="sticky top-0 z-10 bg-white border-b">
            <div className="flex items-center justify-between pl-6 pr-13 py-2.5">
              <div className="flex items-center gap-4">
                <Logo className="h-6 w-auto" />
                {showSearch && (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-8 h-8 w-64 text-sm"
                      placeholder="Search by ID or title…"
                      value={query}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                )}
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
