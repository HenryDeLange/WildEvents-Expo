import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

function Welcome() {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <View style={styles.welcomeWrapper}>
            <Text variant='displayLarge' style={styles.text}>
                {t('welcomeTitle')}
            </Text>
            <Text variant='titleMedium' style={styles.text}>
                {t('welcomeSubTitle')}
            </Text>
            <Divider style={styles.sectionDivider} />
            <Text variant='titleLarge'
                style={{
                    color: theme.colors.onSecondaryContainer,
                    backgroundColor: theme.colors.secondaryContainer,
                    paddingHorizontal: 8,
                    borderRadius: 8
                }}
            >
                ALPHA: This website is still under active development. This is a very unpolished preview release for early testing and feedback.
            </Text>
        </View>
    );
}

export default Welcome;

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
