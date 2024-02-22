import { memo, useCallback } from 'react';
import { doLogout } from '../../state/redux/auth/authSlice';
import { REFRESH_TOKEN, saveData } from '../../state/redux/auth/authStorage';
import { useAppDispatch } from '../../state/redux/hooks';
import HeaderButton from '../ui/HeaderButton';

export default memo(function () {
    const dispatch = useAppDispatch();
    const handleLogout = useCallback(() => {
        dispatch(doLogout());
        saveData(REFRESH_TOKEN, '');
    }, [dispatch]);
    return (
        <HeaderButton
            href='/'
            icon='logout-variant'
            textKey='logoutButton'
            onPress={handleLogout}
        />
    );
});
