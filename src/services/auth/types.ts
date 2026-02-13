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
  updated_at?: string;
  admin?: UserResponse;
  approver?: UserResponse;
  requester: UserResponse;
}

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  role?: string;
}

export interface MeResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
}

export interface RequestDetailResponse {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  description?: string;
  business_justification?: string;
  type: RequestType;
  subtype: RequestType;
  requester: UserResponse;
  created_at: string;
  updated_at: string;
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
