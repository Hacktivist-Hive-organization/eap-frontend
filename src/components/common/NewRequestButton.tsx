import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NewRequestButton() {
  return (
    <Button asChild>
      <Link to="/request/new">
        <PlusIcon className="h-4 w-4" />
        New Request
      </Link>
    </Button>
  );
}
