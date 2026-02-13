import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useAuth';

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  showIcon?: boolean;
  showText?: boolean;
}

export function LogoutButton({
  variant = 'outline',
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const logout = useLogout();

  return (
    <Button variant={variant} onClick={logout}>
      {showIcon && <LogOutIcon className="h-4 w-4" />}
      {showText && <span>Logout</span>}
    </Button>
  );
}
