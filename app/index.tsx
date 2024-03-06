import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import HomeCard from '../components/home/HomeCard';
import HeaderLinkButton from '../components/ui/HeaderLinkButton';
import PageContainer from '../components/ui/PageContainer';

export default function Home() {
    const { t } = useTranslation();
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            <HeaderLinkButton icon='account-plus' href='/register' textKey='registerButton' />
            <HeaderLinkButton icon='information-outline' href='/about' textKey='aboutButton' />
        </View>
    ), []);
    return (
        <PageContainer style={styles.container}>
            <Stack.Screen options={{
                title: t('app'),
                headerRight: navBarActions
            }} />
            <HomeCard />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start'
    },
    actions: {
        flexDirection: 'row'
    }
});
