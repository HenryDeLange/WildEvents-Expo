import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { setAccessToken, setRefreshToken } from '../../state/redux/auth/authSlice';
import { useAppDispatch } from '../../state/redux/hooks';

export default memo(function () {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const handleLogout = useCallback(() => {
        dispatch(setAccessToken(null));
        dispatch(setRefreshToken(null));
        router.replace('/');
    }, [dispatch, setAccessToken, setRefreshToken, router]);
    return (
        <Button
            mode='text'
            icon='logout-variant'
            onPress={handleLogout}
        >
            {t('logoutButton')}
        </Button>
    );
});
