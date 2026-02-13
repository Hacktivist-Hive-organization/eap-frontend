import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src="../src/assets/Desk-X_tr.svg"
      alt="Desk-X logo"
      className={cn('object-contain', className)}
    />
  );
}
