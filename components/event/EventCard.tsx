import { useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Icon, Text, Tooltip } from 'react-native-paper';
import { Event } from '../../state/redux/api/wildEventsApi';
import EventDates from './components/EventDates';

type Props = {
    event: Event;
}

function EventCard({ event }: Readonly<Props>) {
    const { t } = useTranslation();
    const router = useRouter();
    const handleView = useCallback((event: Event) => () => router.push(`/events/${event.id}`), []);
    return (
        <Card key={event.id} style={styles.card}>
            <View style={styles.row}>
                <Text variant='headlineLarge'>
                    {event.name}
                </Text>
                {event.visibility === 'PRIVATE' &&
                    <View style={styles.lockWrapper}>
                        <Tooltip title={t(`eventVisibilityPRIVATE`)}>
                            <Icon source='lock' size={24} />
                        </Tooltip>
                    </View>
                }
            </View>
            <View style={styles.wrapper}>
                <EventDates event={event} tooltip />
                <ScrollView style={styles.description}>
                    <Markdown>{event.description ?? ''}</Markdown>
                </ScrollView>
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
        maxWidth: 420
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#5559',
        backgroundColor: '#DDD8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        height: 140
    },
    row: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 8,
        justifyContent: 'center'
    },
    lockWrapper: {
        marginLeft: 4,
        justifyContent: 'center'
    },
    wrapper: {
        gap: 12
    }
});
