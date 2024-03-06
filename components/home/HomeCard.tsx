import { Link } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { selectAuthRefreshToken } from '../../state/redux/auth/authSlice';
import { useAppSelector } from '../../state/redux/hooks';
import { useIsMobile } from '../ui/utils';
import Welcome from './Welcome';

function Home() {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const hasRefreshToken = !!useAppSelector(selectAuthRefreshToken);
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 450
    }), [isMobile]);
    return (
        <>
            <Welcome />
            <Card elevation={3} style={[styles.card, cardStyle]} contentStyle={styles.cardContent}>
                <Card.Title title={t('app')} titleVariant='headlineMedium' style={styles.title} />
                {hasRefreshToken
                    ? (
                        <Link href='/events/' asChild>
                            <Button mode='contained' icon='login-variant' uppercase style={styles.button}>
                                {t('eventsNavTitle')}
                            </Button>
                        </Link>
                    )
                    : (
                        <Link href='/login' asChild>
                            <Button mode='contained' icon='login-variant' uppercase style={styles.button}>
                                {t('loginButton')}
                            </Button>
                        </Link>
                    )
                }
            </Card>
        </>
    );
};

export default Home;

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
    }
});
