import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/services/auth';
import { authService } from '@/services/auth';
import { clearUser, setUser } from '@/store/slices/userSlice';
import { useAppDispatch } from './useRedux';

function useAuthSuccess(redirectTo: string) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (response: AuthResponse) => {
    authService.setToken(response.access_token);
    dispatch(setUser(response.user));
    navigate(redirectTo, { replace: true });
  };
}

export function useLogin(redirectTo: string = '/') {
  const onSuccess = useAuthSuccess(redirectTo);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess,
  });
}

export function useRegister(redirectTo: string = '/') {
  const onSuccess = useAuthSuccess(redirectTo);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess,
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
