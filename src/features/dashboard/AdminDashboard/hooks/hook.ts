import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/api/requests/user';

export function useAllUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userService.getAll(),
  });
}
