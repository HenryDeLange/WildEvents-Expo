import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { doLogout } from '../../state/redux/auth/authSlice';
import { useAppDispatch } from '../../state/redux/hooks';

export default memo(function () {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const handleLogout = useCallback(() => {
        dispatch(doLogout());
        router.replace('/');
    }, [dispatch, doLogout, router]);
    return (
        <Button
            mode='text'
            icon='logout-variant'
            onPress={handleLogout}
            uppercase
        >
            {t('logoutButton')}
        </Button>
    );
});
