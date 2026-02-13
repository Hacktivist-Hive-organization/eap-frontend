import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/useRedux';
import { authService } from '@/services/auth';
import { clearUser, setUser } from '@/store/slices/userSlice';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const hasToken = authService.isAuthenticated();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: hasToken,
    staleTime: FIFTEEN_MINUTES,
    gcTime: FIFTEEN_MINUTES,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      authService.logout();
      dispatch(clearUser());
    }
  }, [isError, dispatch]);

  return { isLoading: hasToken && isLoading };
}
