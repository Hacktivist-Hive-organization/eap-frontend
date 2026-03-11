import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppSelector } from '@/hooks/useRedux';
import { formatUserName, getInitials } from '@/utils';

interface UserAccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserAccountSheet({
  open,
  onOpenChange,
}: UserAccountSheetProps) {
  const user = useAppSelector((state) => state.userState.user);

  if (!user) return null;

  const fullName = formatUserName(user);
  const initials = getInitials(fullName);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarFallback className="rounded-xl text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">{fullName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <InfoRow label="First name" value={user.first_name} />
            <InfoRow label="Last name" value={user.last_name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow
              label="Role"
              value={
                <Badge variant="secondary" className="capitalize w-fit">
                  {user.role}
                </Badge>
              }
            />
            <InfoRow
              label="Out of office"
              value={
                user.is_out_of_office ? (
                  <Badge variant="destructive">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {typeof value === 'string' ? (
        <span className="text-sm font-medium">{value}</span>
      ) : (
        value
      )}
    </div>
  );
}
