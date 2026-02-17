import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!isAxiosError(error)) return false;

        const status = error.response?.status;

        if (error.code === 'ERR_NETWORK') return false;
        if (error.code === 'ERR_CANCELED') return false;
        if (status && status >= 400 && status < 500) return false;

        return failureCount < 3;
      },
    },
  },
});

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
