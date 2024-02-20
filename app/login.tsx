import { Link, Stack } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import PageContainer from '../components/ui/PageContainer';
import LoginCard from '../components/user/LoginCard';

export default function Login() {
    const { t } = useTranslation();
    const navBarActions = useCallback(() => (
        <Link replace href='/register' asChild>
            <Button mode='text' icon='account-plus'>
                {t('registerButton')}
            </Button>
        </Link>
    ), []);
    return (
        <PageContainer>
            <Stack.Screen options={{
                title: t('loginNavTitle'),
                headerRight: navBarActions
            }} />
            <LoginCard />
        </PageContainer>
    );
}
