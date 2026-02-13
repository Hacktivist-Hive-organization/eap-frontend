import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onClick: () => void;
};

export function NewRequestButton({ onClick }: Props) {
  return (
    <Button onClick={onClick}>
      <PlusIcon className="h-4 w-4" />
      New Request
    </Button>
  );
}
