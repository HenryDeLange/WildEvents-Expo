import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
};

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthState>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout: () => initialState,
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string | null>) => {
            state.refreshToken = action.payload;
        }
    }
});

export const { login, logout, setAccessToken, setRefreshToken } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
