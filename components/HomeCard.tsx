import { Link } from 'expo-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, Card } from 'react-native-paper';
import EventsWelcome from './event/EventsWelcome';
import { useIsMobile } from './ui/utils';

export default memo(function () {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = {
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 450
    };
    return (
        <>
            <EventsWelcome />
            <Card elevation={3} style={[styles.card, cardStyle]} contentStyle={styles.cardContent}>
                <Card.Title title={t('app')} titleVariant='headlineMedium' style={styles.title} />
                <Link href='/login' asChild>
                    <Button mode='contained' icon='login-variant' uppercase style={styles.button}>
                        {t('loginButton')}
                    </Button>
                </Link>
            </Card>
        </>
    );
});

const styles = StyleSheet.create({
    card: {
        padding: 20
    },
    cardContent: {
        alignItems: 'center'
    },
    title: {
        marginBottom: 12
    },
    button: {
        width: '90%',
        marginBottom: 10
    },
    actions: {
        flexDirection: 'row'
    }
});
