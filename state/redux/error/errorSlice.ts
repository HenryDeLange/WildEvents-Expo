import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type BackendErrorData = {
    type: string;
    context: string;
    message: string;
    code: string;
    target: string;
}

export type RtkError = {
    type: string;
    error: {
        message: string;
    }
    meta: {
        requestStatus: string;
        arg: {
            endpointName: string;
            type: string;
        }
        baseQueryMeta: {
            request: {
                method: string;
                url: string;
            };
        }
    }
    payload: {
        status: string;
        // From FE
        error?: string;
        // From BE
        data?: {
            status: string;
            message: string;
            exception: string;
            errors?: BackendErrorData[];
        }
    }
}

type ErrorState = {
    errors: RtkError[];
}

const initialState: ErrorState = {
    errors: []
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        addError: (state, action: PayloadAction<RtkError>) => {
            state.errors.push(action.payload);
        },
        removeAllErrors: () => initialState
    }
});

export const { addError, removeAllErrors } = errorSlice.actions;

export const selectErrors = (state: RootState) => state.error.errors;

export default errorSlice.reducer;
