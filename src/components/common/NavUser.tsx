import { LogOutIcon, UserRoundIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useRedux';
import { getInitials } from '@/utils';

export function NavUser() {
  const user = useAppSelector((state) => state.userState.user);
  const logout = useLogout();

  if (!user) return null;

  const fullName = `${user.first_name} ${user.last_name}`;
  const initials = getInitials(fullName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarFallback className="rounded-md text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium">{fullName}</span>
            <span className="truncate text-xs capitalize text-muted-foreground">
              {user.role}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserRoundIcon />
            Account
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
