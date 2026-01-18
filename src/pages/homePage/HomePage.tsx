import { TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
  return (
    <div>
      <Button type="submit">
        <TrashIcon />
        Submit
      </Button>
    </div>
  );
};
