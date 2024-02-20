import { format } from 'date-fns';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Event } from '../../state/redux/api/wildEventsApi';

type Props = {
    event: Event;
}

function EventDates({ event }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <View style={styles.wrapper}>
            <View style={styles.row}>
                <Icon source='calendar-arrow-right' size={20} />
                <Text variant='bodyMedium' style={styles.text}>
                    {t('eventCardStartDate')}
                </Text>
                <Text variant='bodyMedium'>
                    {format(event.start, 'yyyy-MM-dd')}
                </Text>
            </View>
            <View style={styles.row}>
                <Icon source='calendar-arrow-left' size={20} />
                <Text variant='bodyMedium' style={styles.text}>
                    {t('eventCardStopDate')}
                </Text>
                <Text variant='bodyMedium'>
                    {format(event.stop, 'yyyy-MM-dd')}
                </Text>
            </View>
            <View style={styles.row}>
                <Icon source='calendar-edit' size={20} />
                <Text variant='bodyMedium' style={styles.text}>
                    {t('eventCardCloseDate')}
                </Text>
                <Text variant='bodyMedium'>
                    {format(event.close, 'yyyy-MM-dd')}
                </Text>
            </View>
        </View>
    );
}

export default memo(EventDates);

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 35,
        marginHorizontal: 20
    },
    row: {
        flexDirection: 'row'
    },
    text: {
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 10
    }
});
