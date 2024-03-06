import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, ViewStyle } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ExternalLink } from '../components/ui/ExternalLink';
import PageContainer from '../components/ui/PageContainer';
import { useIsMobile } from '../components/ui/utils';
import { useGetVersionQuery } from '../state/redux/api/wildEventsApi';
import { useMemo } from 'react';

export default function About() {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const { data, isFetching } = useGetVersionQuery();
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 500
    }), [isMobile]);
    return (
        <PageContainer style={styles.cardSpacer}>
            <Stack.Screen options={{
                title: t('aboutNavTitle')
            }} />
            <Image source={require('../assets/images/logo.png')} style={styles.image} />
            <Card style={cardStyle}>
                <Card.Title titleVariant='titleLarge' title={t('aboutTitle')} />
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
                <Card.Title titleVariant='titleLarge' title={t('aboutClient')} />
                <Card.Content>
                    <Text>
                        {Constants.expoConfig?.version}
                    </Text>
                </Card.Content>
            </Card>
            <Card style={cardStyle}>
                <Card.Title titleVariant='titleLarge' title={t('aboutServer')} />
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
    },
    image: {
        width: 100,
        height: 100
    }
});
