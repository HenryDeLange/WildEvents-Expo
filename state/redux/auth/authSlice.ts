import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type AuthFullState = {
    accessToken: string | null;
    refreshToken: string | null;
    username: string | null;
    inaturalist: string | null;
};

const initialState: AuthFullState = {
    username: null,
    inaturalist: null,
    accessToken: null,
    refreshToken: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        doLogin: (state, action: PayloadAction<AuthFullState>) => {
            state.username = action.payload.username;
            state.inaturalist = action.payload.inaturalist;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        doRefresh: (state, action: PayloadAction<AuthFullState>) => {
            state.username = action.payload.username;
            state.inaturalist = action.payload.inaturalist;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        doLogout: () => initialState,
        replaceAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string | null>) => {
            state.refreshToken = action.payload;
        }
    }
});

export const {
    doLogin,
    doRefresh,
    doLogout,
    replaceAccessToken,
    setRefreshToken
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUsername = (state: RootState) => state.auth.username;
export const selectAuthINaturalist = (state: RootState) => state.auth.inaturalist;
export const selectAuthAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
