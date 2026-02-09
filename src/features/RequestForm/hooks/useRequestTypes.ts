import { useEffect, useState } from 'react';
import { createRequestService } from '@/services/api/requests/request';
import type { RequestTypeSubTypes } from '@/services/auth/types';

let cachedTypes: RequestTypeSubTypes[] | null = null;

export function useRequestTypes() {
  const [types, setTypes] = useState<RequestTypeSubTypes[]>(cachedTypes ?? []);
  const [loading, setLoading] = useState(!cachedTypes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedTypes) return;

    createRequestService
      .getRequestTypes()
      .then((data) => {
        cachedTypes = data;
        setTypes(data);
      })
      .catch(() => setError('Failed to load request types'))
      .finally(() => setLoading(false));
  }, []);

  return { types, loading, error };
}
