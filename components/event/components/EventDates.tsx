import { format, isBefore } from 'date-fns';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, Tooltip, useTheme } from 'react-native-paper';
import { Event } from '../../../state/redux/api/wildEventsApi';

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
                highlight={!isBefore(format(event.start, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd'))}
            />
            <DateInfo
                date={event.stop}
                icon='calendar-arrow-left'
                label='eventStopDate'
                tooltip={tooltip}
                highlight={!isBefore(format(event.stop, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd'))}
            />
            <DateInfo
                date={event.close}
                icon='calendar-lock'
                label='eventCloseDate'
                tooltip={tooltip}
                highlight={!isBefore(format(event.close, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd'))}
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
    highlight?: boolean;
}

function DateInfo({ date, icon, label, tooltip, highlight }: Readonly<DateProps>) {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <View style={styles.row}>
            {tooltip &&
                <Tooltip title={t(label)}>
                    <View style={styles.row}>
                        <Icon source={icon} size={18} color={highlight ? theme.colors.secondary : undefined} />
                        <Text variant='bodyMedium' style={[styles.date,  { color: highlight ? theme.colors.secondary : undefined }]}>
                            {format(date, 'yyyy-MM-dd')}
                        </Text>
                    </View>
                </Tooltip>
            }
            {!tooltip &&
                <>
                    <Icon source={icon} size={20} color={highlight ? theme.colors.secondary : undefined} />
                    <Text variant='bodyMedium' style={[styles.label, { color: highlight ? theme.colors.secondary : undefined }]}>
                        {t(label)}sss
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
