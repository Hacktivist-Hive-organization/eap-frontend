import type { Priority } from '@/types/Priority';
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
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface RequestType {
  id: number;
  name: string;
}

export interface RequestResponse {
  id: number;
  title: string;
  description: string;
  business_justification: string;
  priority: Priority;
  status: Status;
  type: RequestType;
  subtype: RequestType;
  created_at: string;
  updated_at: string | null;
}
