import { Link } from 'expo-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { Button, Card } from 'react-native-paper';

export default memo(function () {
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const cardStyle: ViewStyle = {
        width: width < 450 ? '90%' : '80%',
        maxWidth: width > 450 ? 400 : undefined
    };
    return (
        <Card elevation={3} style={[styles.card, cardStyle]} contentStyle={styles.cardContent}>
            <Image source={require('../assets/images/logo.png')} style={{ width: 100, height: 100 }} />
            <Card.Title title={t('app')} titleVariant='displayMedium' style={styles.title} />
            <Link href='/login' asChild>
                <Button mode='contained' icon='login-variant' uppercase style={styles.button}>
                    {t('loginButton')}
                </Button>
            </Link>
        </Card>
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
        marginVertical: 20
    },
    button: {
        width: '90%',
        marginBottom: 10
    },
    actions: {
        flexDirection: 'row'
    }
});
