import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import CreateEvent from './CreateEvent';

function EventsWelcome() {
    const { t } = useTranslation();
    return (
        <>
            <View style={styles.welcomeWrapper}>
                <Text variant='displayLarge'>
                    {t('welcomeTitle')}
                </Text>
                <Text variant='titleMedium'>
                    {t('welcomeSubTitle')}
                </Text>
                <Divider style={styles.sectionDivider} />
                <View style={styles.actionWrapper}>
                    <Text variant='titleMedium'>
                        {t('welcomeAction')}
                    </Text>
                    <View style={styles.createWrapper}>
                        <CreateEvent />
                    </View>
                </View>
            </View>
            <Divider style={styles.footerDivider} />
        </>
    );
}

export default memo(EventsWelcome);

const styles = StyleSheet.create({
    welcomeWrapper: {
        margin: 20,
        alignItems: 'center'
    },
    sectionDivider: {
        marginTop: 10,
        marginBottom: 20,
        width: '80%'
    },
    actionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    createWrapper: {
        marginHorizontal: 20
    },
    footerDivider: {
        width: '100%',
        height: 2
    }
});
