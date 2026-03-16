import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
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

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully');
      navigate('/login', { replace: true });
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
