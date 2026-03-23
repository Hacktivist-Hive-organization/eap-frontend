import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getAvatarUrl, getInitials } from '@/utils';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name: string;
  className?: string;
  rounded?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  avatarUrl,
  name,
  className,
  rounded,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn(rounded, className)}>
      <AvatarImage src={getAvatarUrl(avatarUrl)} className={rounded} />
      <AvatarFallback className={cn(rounded, fallbackClassName)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
