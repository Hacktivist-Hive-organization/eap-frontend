import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest, RegisterRequest } from '@/services/auth';
import { authService } from '@/services/auth';
import { clearUser, setUser } from '@/store/slices/userSlice';
import { useAppDispatch } from './useRedux';

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      authService.setToken(response.access_token);
      dispatch(setUser(response.user));
      navigate('/');
    },
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      authService.setToken(response.access_token);
      dispatch(setUser(response.user));
      navigate('/');
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return () => {
    authService.logout();
    dispatch(clearUser());
    navigate('/login');
  };
}
