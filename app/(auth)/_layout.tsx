import { Redirect, Stack } from 'expo-router';
import { memo } from 'react';
import { selectAuthRefreshToken } from '../../state/redux/auth/authSlice';
import { useAppSelector } from '../../state/redux/hooks';

export default memo(function () {
    const refreshToken = useAppSelector(selectAuthRefreshToken);
    // Only require authentication within the layouts nested under "(auth)"
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
