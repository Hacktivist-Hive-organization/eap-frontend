import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import type { LoginRequest, RegisterRequest } from '@/services/auth';
import { useAppDispatch } from './useRedux';
import { clearUser, setUser } from '@/store/slices/userSlice';

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      authService.setToken(response.token);
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
      authService.setToken(response.token);
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
