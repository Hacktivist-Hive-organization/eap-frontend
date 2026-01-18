import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/userSlice';

export const store = configureStore({
  reducer: {
    userState: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
