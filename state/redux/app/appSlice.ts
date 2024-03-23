import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type AppFullState = {
    event: {
        isDeleting: boolean;
    }
};

const initialState: AppFullState = {
    event: {
        isDeleting: false
    }
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setEventIsDeleting: (state, action: PayloadAction<boolean>) => {
            state.event.isDeleting = action.payload;
        }
    }
});

export const {
    setEventIsDeleting
} = appSlice.actions;

export const selectEventIsDeleting = (state: RootState) => state.app.event.isDeleting;

export default appSlice.reducer;
