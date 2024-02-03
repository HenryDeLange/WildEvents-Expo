import { memo } from 'react';
import { useAppSelector } from '../../state/redux/hooks';
import { selectAuthRefreshToken } from '../../state/redux/auth/authSlice';
import { Redirect, Slot, Stack } from 'expo-router';

export default memo(function () {
    const refreshToken = useAppSelector(selectAuthRefreshToken);
    // Only require authentication within the layouts nested under "(auth)""
    if (!refreshToken) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/" />;
    }
    // This layout can be deferred because it's not the root layout.
    return <>
        <Stack.Screen options={{
            headerShown: false
        }} />
        <Stack />
    </>;
});
