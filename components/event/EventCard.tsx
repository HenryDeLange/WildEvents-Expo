import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Icon, Text, Tooltip } from 'react-native-paper';
import { Event } from '../../state/redux/api/wildEventsApi';

type Props = {
    event: Event;
}

function EventCard({ event }: Readonly<Props>) {
    const { t } = useTranslation();
    const router = useRouter();
    const handleView = useCallback((event: Event) => () => router.push(`/events/${event.id}`), []);
    return (
        <Card key={event.id} style={styles.card}>
            <Text variant='headlineLarge'>
                {event.name}
            </Text>
            <View>
                <View style={styles.dates}>
                    <Tooltip title={t('eventCardStartDate')}>
                        <View style={styles.row}>
                            <Icon source='calendar-arrow-right' size={20} />
                            <Text>{format(event.start, 'yyyy-MM-dd')}</Text>
                        </View>
                    </Tooltip>
                    <Tooltip title={t('eventCardStopDate')}>
                        <View style={styles.row}>
                            <Icon source='calendar-arrow-left' size={20} />
                            <Text>{format(event.stop, 'yyyy-MM-dd')}</Text>
                        </View>
                    </Tooltip>
                    <Tooltip title={t('eventCardCloseDate')}>
                        <View style={styles.row}>
                            <Icon source='calendar-edit' size={20} />
                            <Text>{format(event.close, 'yyyy-MM-dd')}</Text>
                        </View>
                    </Tooltip>
                </View>
                <ScrollView style={styles.description}>
                    <Markdown>{event.description ?? ''}</Markdown>
                </ScrollView>
                <Divider style={styles.divider} />
                <Button mode='text' icon='eye' uppercase
                    onPress={handleView(event)}
                >
                    {t('view')}
                </Button>
            </View>
        </Card>
    );
}

export default memo(EventCard);

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 12,
        alignItems: 'center',
        gap: 6,
        maxWidth: 400
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#EFD8',
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 4
    },
    dates: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginVertical: 8
    },
    row: {
        flexDirection: 'row',
        gap: 4
    },
    divider: {
        width: '100%',
        marginVertical: 8
    }
});
