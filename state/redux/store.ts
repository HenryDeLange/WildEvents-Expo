import { Middleware, MiddlewareAPI, configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { UnknownAsyncThunkRejectedWithValueAction } from '@reduxjs/toolkit/dist/matchers';
import { setupListeners } from '@reduxjs/toolkit/query';
import { inatApi } from './api/inatApi';
import { wildEventsApi } from './api/wildEventsApi';
import appReducer from './app/appSlice';
import authReducer from './auth/authSlice';
import errorReducer, { addError } from './error/errorSlice';

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const rejectedAction = action as UnknownAsyncThunkRejectedWithValueAction;
        console.error('ERROR:', rejectedAction);
        api.dispatch(addError({
            type: rejectedAction.type,
            error: {
                message: rejectedAction.error.message ?? 'unknown'
            },
            meta: {
                requestStatus: (rejectedAction.meta as any).requestStatus ?? 'unknown',
                arg: {
                    endpointName: (rejectedAction.meta.arg as any).endpointName ?? 'unknown',
                    type: (rejectedAction.meta.arg as any).type ?? 'unknown'
                },
                baseQueryMeta: {
                    request: {
                        method: (rejectedAction.meta as any).baseQueryMeta?.request?.method ?? 'unknown',
                        url: (rejectedAction.meta as any).baseQueryMeta?.request?.url ?? 'unknown'
                    }
                }
            },
            payload: {
                status: (rejectedAction.payload as any).status ?? 'unknown',
                error: (rejectedAction.payload as any).error ?? undefined, // From FE
                data: (rejectedAction.payload as any).data ?? undefined // From BE
            }
        }));
    }
    return next(action);
}

export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        error: errorReducer,
        [wildEventsApi.reducerPath]: wildEventsApi.reducer,
        [inatApi.reducerPath]: inatApi.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(wildEventsApi.middleware)
            .concat(inatApi.middleware)
            .concat(rtkQueryErrorLogger);
    }
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
