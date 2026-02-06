import type { Priority } from '@/types/Priority';
import type { Role } from '@/types/Role';
import type { Status } from '@/types/Status';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: Role;
  };
}

export interface RequestType {
  id: number;
  name: string;
}

export interface RequestAllResponse {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  type: RequestType;
  subtype: RequestType;
  created_at: string;
  updated_at: string | null;
}
