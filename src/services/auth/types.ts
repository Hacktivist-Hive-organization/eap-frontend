import type { Priority } from '@/types/Priority';
import type { Role } from '@/types/Role';
import type { Status } from '@/types/Status';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
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
    is_out_of_office: boolean;
    avatar_url: string | null;
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
  current_status: Status;
  type: RequestType;
  subtype: RequestType;
  created_at: string;
  updated_at?: string;
  requester: UserResponse;
  assignee?: UserResponse;
}

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  role?: string;
  avatar_url?: string | null;
}

export interface MeResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  is_out_of_office: boolean;
  avatar_url: string | null;
}

export interface RequestDetailResponse {
  id: number;
  title: string;
  priority: Priority;
  current_status: Status;
  description?: string;
  business_justification?: string;
  type: RequestType;
  subtype: RequestType;
  requester: UserResponse;
  assignee?: UserResponse;
  created_at: string;
  updated_at: string;
}

export interface TrackingEntry {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_out_of_office: boolean;
    avatar_url?: string | null;
  };
  comment: string;
  status: Status;
  created_at?: string;
}

export interface CreateRequestPayload {
  type_id: number;
  subtype_id: number;
  title: string;
  description: string;
  business_justification: string;
  priority: string;
}

export interface RequestSubtype {
  id: number;
  name: string;
}

export interface RequestTypeSubTypes {
  id: number;
  name: string;
  subtypes: RequestSubtype[];
}
