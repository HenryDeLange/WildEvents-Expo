import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderLinkButton from '../components/ui/HeaderLinkButton';
import PageContainer from '../components/ui/PageContainer';
import LoginCard from '../components/user/LoginCard';

export default function Login() {
    const { t } = useTranslation();
    const navBarActions = useCallback(() => (
        <HeaderLinkButton icon='account-plus' href='/register' textKey='registerButton' />
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
