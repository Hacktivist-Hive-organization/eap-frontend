import deskXLogo from '@/assets/Desk-X_tr.svg';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src={deskXLogo}
      alt="Desk-X logo"
      className={cn('object-contain', className)}
    />
  );
}
