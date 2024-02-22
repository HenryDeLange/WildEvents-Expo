import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ExternalLink } from '../components/ui/ExternalLink';
import PageContainer from '../components/ui/PageContainer';
import { useGetVersionQuery } from '../state/redux/api/wildEventsApi';

export default function About() {
    const { t } = useTranslation();
    const { data, isFetching } = useGetVersionQuery();
    const { width } = useWindowDimensions();
    const cardStyle: ViewStyle = {
        width: width < 500 ? '90%' : '80%',
        maxWidth: width > 700 ? 650 : undefined
    };
    return (
        <PageContainer style={styles.cardSpacer}>
            <Stack.Screen options={{
                title: t('aboutNavTitle')
            }} />
            <Image source={require('../assets/images/logo.png')} style={{ width: 100, height: 100 }} />
            <Card style={cardStyle}>
                <Card.Title title={t('aboutTitle')} titleVariant='titleLarge' />
                <Card.Content>
                    <Text>
                        {t('aboutDetails')}
                    </Text>
                </Card.Content>
                <Card.Actions>
                    <ExternalLink href='http://www.mywild.co.za'>
                        {t('aboutMyWildLink')}
                    </ExternalLink>
                    <ExternalLink href='https://www.inaturalist.org'>
                        {t('aboutINatLink')}
                    </ExternalLink>
                </Card.Actions>
            </Card>
            <Card style={cardStyle}>
                <Card.Title title={t('aboutClient')} titleVariant='titleLarge' />
                <Card.Content>
                    <Text>
                        {Constants.expoConfig?.version}
                    </Text>
                </Card.Content>
            </Card>
            <Card style={cardStyle}>
                <Card.Title title={t('aboutServer')} titleVariant='titleLarge' />
                <Card.Content>
                    <Text>
                        {isFetching ? t('loading') : data?.appVersion}
                    </Text>
                </Card.Content>
            </Card>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    cardSpacer: {
        gap: 15
    }
});
