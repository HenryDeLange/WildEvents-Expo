import { format } from 'date-fns';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, Tooltip } from 'react-native-paper';
import { Event } from '../../state/redux/api/wildEventsApi';

type Props = {
    event: Event;
    tooltip?: boolean;
}

function EventDates({ event, tooltip }: Readonly<Props>) {
    return (
        <View style={styles.wrapper}>
            <DateInfo
                date={event.start}
                icon='calendar-arrow-right'
                label='eventStartDate'
                tooltip={tooltip}
            />
            <DateInfo
                date={event.stop}
                icon='calendar-arrow-left'
                label='eventStopDate'
                tooltip={tooltip}
            />
            <DateInfo
                date={event.close}
                icon='calendar-lock'
                label='eventCloseDate'
                tooltip={tooltip}
            />
        </View>
    );
}

export default memo(EventDates);

type DateProps = {
    date: string;
    icon: 'calendar-arrow-left' | 'calendar-arrow-right' | 'calendar-lock';
    label: string;
    tooltip?: boolean;
}

function DateInfo({ date, icon, label, tooltip }: Readonly<DateProps>) {
    const { t } = useTranslation();
    return (
        <View style={styles.row}>
            {tooltip &&
                <Tooltip title={t(label)}>
                    <View style={styles.row}>
                        <Icon source={icon} size={18} />
                        <Text variant='bodySmall' style={styles.date}>
                            {format(date, 'yyyy-MM-dd')}
                        </Text>
                    </View>
                </Tooltip>
            }
            {!tooltip &&
                <>
                    <Icon source={icon} size={20} />
                    <Text variant='bodyMedium' style={styles.label}>
                        {t(label)}
                    </Text>
                    <Text variant='bodyMedium' style={styles.date}>
                        {format(date, 'yyyy-MM-dd')}
                    </Text>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 32,
        rowGap: 8,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    label: {
        fontWeight: 'bold',
        marginLeft: 4
    },
    date: {
        marginLeft: 4
    }
});
