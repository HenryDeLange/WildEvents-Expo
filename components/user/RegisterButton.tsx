import { Link } from 'expo-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

export default memo(function () {
    const { t } = useTranslation();
    return (
        <Link href='/register' asChild>
            <Button mode='text' icon='account-plus'>
                {t('registerButton')}
            </Button>
        </Link>
    );
});
