import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type AppFullState = {
    event: {
        isDeleting: boolean;
    };
    activity: {
        isDeleting: boolean;
    };
};

const initialState: AppFullState = {
    event: {
        isDeleting: false
    },
    activity: {
        isDeleting: false
    }
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setEventIsDeleting: (state, action: PayloadAction<boolean>) => {
            state.event.isDeleting = action.payload;
        },
        setActivityIsDeleting: (state, action: PayloadAction<boolean>) => {
            state.activity.isDeleting = action.payload;
        }
    }
});

export const {
    setEventIsDeleting,
    setActivityIsDeleting
} = appSlice.actions;

export const selectEventIsDeleting = (state: RootState) => state.app.event.isDeleting;
export const selectActivityIsDeleting = (state: RootState) => state.app.event.isDeleting;

export default appSlice.reducer;
