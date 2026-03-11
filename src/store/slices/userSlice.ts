import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Role } from '@/types/Role';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_out_of_office: boolean;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setOutOfOffice: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.is_out_of_office = action.payload;
      }
    },
    updateUserProfile: (
      state,
      action: PayloadAction<{ first_name: string; last_name: string }>,
    ) => {
      if (state.user) {
        state.user.first_name = action.payload.first_name;
        state.user.last_name = action.payload.last_name;
      }
    },
  },
});

export const { setUser, clearUser, setOutOfOffice, updateUserProfile } =
  userSlice.actions;
export default userSlice.reducer;
