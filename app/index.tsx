import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import HomeCard from '../components/HomeCard';
import PageContainer from '../components/ui/PageContainer';
import { useTranslation } from 'react-i18next';
import RegisterButton from '@/components/user/RegisterButton';
import AboutButton from '@/components/AboutButton';

export default function Home() {
    const { t } = useTranslation();
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            <RegisterButton />
            <AboutButton />
        </View>
    ), []);
    return (
        <PageContainer>
            <Stack.Screen options={{
                title: t('app'),
                headerRight: navBarActions
            }} />
            <HomeCard />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row'
    }
});
