import { ShieldAlertIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Background } from '@/components/common/Background';
import { Button } from '@/components/ui/button';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Background>
      <div className="flex flex-col items-center gap-4 text-center">
        <ShieldAlertIcon className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
        <p className="max-w-md text-gray-600">
          You don't have permission to access this page. Contact your
          administrator if you believe this is a mistake.
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </Background>
  );
}
