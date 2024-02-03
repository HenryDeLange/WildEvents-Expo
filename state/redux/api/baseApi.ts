import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import * as Localization from 'expo-localization';
import { setAccessToken, setRefreshToken } from '../auth/authSlice';
import { RootState } from '../store';
import { Tokens } from './wildEventsApi';

// Add the token and language to the request header
const rawBaseQuery = fetchBaseQuery({
    baseUrl: ' ', // Needs to be a single space (if empty then RTK Query sets it to the frontend's base URL)
    prepareHeaders: (headers, { getState }) => {
        // Add the JWT Token to the request header
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        // Set the language
        headers.set('Accept-Language', Localization.locale);
        return headers;
    }
});

// Change the baseUrl (root URL of the backend is) based on config
const dynamicUrlBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    // Gracefully handle scenarios where data to generate the URL is missing
    if (!baseUrl) {
        return {
            error: {
                status: 400,
                statusText: 'Bad Request',
                data: 'No baseUrl configured!'
            }
        };
    }
    const urlEnd = typeof args === 'string' ? args : args.url;
    // Construct a dynamically generated portion of the url
    const adjustedUrl = `${baseUrl}${urlEnd}`;
    const adjustedArgs = typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl };
    // Provide the amended url and other params to the raw base query
    return rawBaseQuery(adjustedArgs, api, extraOptions);
}

// Re-authenticate using the refresh token when the access token expired (using mutex to prevent multiple concurrent refresh calls)
const mutex = new Mutex();
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await dynamicUrlBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            // Try to get a new token
            try {
                api.dispatch(setAccessToken((api.getState() as RootState).auth.refreshToken));
                const refreshResult = await dynamicUrlBaseQuery({ url: '/users/refresh', method: 'post' }, api, extraOptions);
                const tokens = refreshResult.data as Tokens;
                if (tokens) {
                    // Store the new token
                    api.dispatch(setAccessToken(tokens.accessToken));
                    api.dispatch(setRefreshToken(tokens.refreshToken));
                    // Retry the initial query
                    result = await dynamicUrlBaseQuery(args, api, extraOptions);
                }
                else {
                    // Logout (clear the tokens)
                    api.dispatch(setAccessToken(null));
                    api.dispatch(setRefreshToken(null));
                }
            }
            finally {
                // Release must be called once the mutex should be released again
                release();
            }
        }
        else {
            // Wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await dynamicUrlBaseQuery(args, api, extraOptions);
        }
    }
    return result;
}

// Retry requests
const staggeredBaseQuery = retry(
    baseQueryWithReauth,
    { maxRetries: 3 }
);

// The empty API service that will be used to inject the auto-generated endpoints into
export const baseSplitApi = createApi({
    reducerPath: 'wildEventsApi',
    baseQuery: staggeredBaseQuery,
    endpoints: () => ({})
});
