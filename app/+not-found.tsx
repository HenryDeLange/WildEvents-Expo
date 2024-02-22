import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function NotFoundScreen() {
    const { t } = useTranslation();
    return (
        <>
            <Stack.Screen options={{ title: t('noPageNavTitle') }} />
            <View style={styles.container}>
                <Text style={styles.title}>
                    {t('noPage')}
                </Text>
                <Link href='/' style={styles.link}>
                    <Text style={styles.linkText}>
                        {t('noPageHome')}
                    </Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
