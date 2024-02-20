import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/ui/PageContainer';
import RegisterCard from '../components/user/RegisterCard';

export default function Register() {
    const { t } = useTranslation();
    return (
        <PageContainer>
            <Stack.Screen options={{
                title: t('registerNavTitle')
            }} />
            <RegisterCard />
        </PageContainer>
    );
}
