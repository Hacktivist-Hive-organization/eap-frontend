import {
  ArrowLeftToLineIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { UserAccountSheet } from '@/components/common/UserAccountSheet';
import { UserAvatar } from '@/components/common/UserAvatar';
import { UserSettingsSheet } from '@/components/common/UserSettingsSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useLogout } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { userService } from '@/services/api/requests/user';
import { setOutOfOffice } from '@/store/slices/userSlice';
import { formatUserName } from '@/utils';

export function NavUser() {
  const user = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();
  const logout = useLogout();
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountMounted, setAccountMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsMounted, setSettingsMounted] = useState(false);

  if (!user) return null;

  const fullName = formatUserName(user);

  const handleOutOfOfficeToggle = async (checked: boolean) => {
    dispatch(setOutOfOffice(checked));
    try {
      await userService.updateMe({ is_out_of_office: checked });
    } catch {
      dispatch(setOutOfOffice(!checked));
    }
  };

  return (
    <>
      {accountMounted && (
        <UserAccountSheet open={accountOpen} onOpenChange={setAccountOpen} />
      )}
      {settingsMounted && (
        <UserSettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative">
              <UserAvatar
                avatarUrl={user.avatar_url}
                name={fullName}
                className="h-9 w-9"
                rounded="rounded-md"
                fallbackClassName="text-xs"
              />
              {user.is_out_of_office && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary ring-2 ring-background">
                  <XIcon className="h-2 w-2 text-white" />
                </span>
              )}
            </div>
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
          <DropdownMenuItem
            onSelect={() => {
              setAccountMounted(true);
              setAccountOpen(true);
            }}
          >
            <UserRoundIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setSettingsMounted(true);
              setSettingsOpen(true);
            }}
          >
            <SettingsIcon />
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ArrowLeftToLineIcon />
            <span className="flex-1">Out of office</span>
            <Switch
              checked={user.is_out_of_office}
              onCheckedChange={handleOutOfOfficeToggle}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
