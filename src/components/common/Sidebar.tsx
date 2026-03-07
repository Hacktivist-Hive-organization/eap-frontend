import { LayoutDashboardIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export interface SidebarItem {
  key: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: number;
  group?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeKey: string;
}

interface ItemGroup {
  label: string | undefined;
  items: SidebarItem[];
}

function toGroups(items: SidebarItem[]): ItemGroup[] {
  return items.reduce<ItemGroup[]>((acc, item) => {
    const group = acc.find((g) => g.label === item.group);
    if (group) {
      group.items.push(item);
    } else {
      acc.push({ label: item.group, items: [item] });
    }
    return acc;
  }, []);
}

function NavItem({
  item,
  activeKey,
}: {
  item: SidebarItem;
  activeKey: string;
}) {
  return (
    <SidebarMenuItem>
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
  );
}

function NavGroup({
  group,
  index,
  activeKey,
}: {
  group: ItemGroup;
  index: number;
  activeKey: string;
}) {
  return (
    <SidebarGroup>
      {index > 0 && (
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
      )}
      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <NavItem key={item.key} item={item} activeKey={activeKey} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
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
        {toGroups(items).map((group, index) => (
          <NavGroup
            key={group.label ?? '__default'}
            group={group}
            index={index}
            activeKey={activeKey}
          />
        ))}
      </SidebarContent>
    </ShadcnSidebar>
  );
}
