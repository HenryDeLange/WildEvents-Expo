import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';

function EventsWelcome() {
    const { t } = useTranslation();
    return (
        <View style={styles.welcomeWrapper}>
            <Text variant='displayLarge' style={styles.text}>
                {t('welcomeTitle')}
            </Text>
            <Text variant='titleMedium' style={styles.text}>
                {t('welcomeSubTitle')}
            </Text>
            <Divider style={styles.sectionDivider} />
        </View>
    );
}

export default memo(EventsWelcome);

const styles = StyleSheet.create({
    welcomeWrapper: {
        margin: 20,
        alignItems: 'center'
    },
    text: {
        textAlign: 'center'
    },
    sectionDivider: {
        marginTop: 10,
        marginBottom: 20,
        width: '80%'
    }
});
