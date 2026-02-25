import { SearchXIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Background } from '@/components/common/Background';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Background>
      <div className="flex flex-col items-center gap-4 text-center">
        <SearchXIcon className="h-16 w-16 text-orange-500" />
        <h1 className="text-2xl font-semibold text-gray-900">Page Not Found</h1>
        <p className="max-w-md text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </Background>
  );
}
