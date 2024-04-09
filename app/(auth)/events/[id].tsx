import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, Icon, Text, Tooltip } from 'react-native-paper';
import ActivityEventTotals from '../../../components/activity/components/ActivityEventTotals';
import ActivityGrid from '../../../components/activity/ActivityGrid';
import EventDates from '../../../components/event/components/EventDates';
import EventAdmins from '../../../components/event/components/admins/EventAdmins';
import CalculateEventButton from '../../../components/event/buttons/CalculateEventButton';
import DeleteEventButton from '../../../components/event/buttons/DeleteEventButton';
import EditEventButton from '../../../components/event/buttons/EditEventButton';
import EventParticipants from '../../../components/event/components/participants/EventParticipants';
import { useIsEventAdmin } from '../../../components/event/utils/hooks';
import ThemedSafeAreaView from '../../../components/ui/ThemedSafeAreaView';
import LogoutButton from '../../../components/user/buttons/LogoutButton';
import { useFindEventQuery } from '../../../state/redux/api/wildEventsApi';

function Event() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindEventQuery({ eventId });
    const isAdmin = useIsEventAdmin(eventId);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.row}>
            {isAdmin &&
                <>
                    <CalculateEventButton eventId={eventId} />
                    <EditEventButton eventId={eventId} />
                    <DeleteEventButton eventId={eventId} />
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, eventId]);
    const navBar = useMemo(() => ({
        title: isEventFetching ? t('loading') : t('eventNavTitle'),
        headerRight: navBarActions
    }), [t, isEventFetching, navBarActions]);
    // RENDER
    if (!event || isEventLoading) {
        return (
            <ThemedSafeAreaView style={styles.container}>
                <Stack.Screen options={navBar} />
                <ActivityIndicator animating={true} size='large' style={styles.loading} />
            </ThemedSafeAreaView>
        );
    }
    return (
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <Stack.Screen options={navBar} />
                <View style={styles.row}>
                    {event.visibility === 'PRIVATE' &&
                        <View style={styles.lockWrapper}>
                            <Tooltip title={t(`eventVisibilityPRIVATE`)}>
                                <Icon source='lock' size={24} />
                            </Tooltip>
                        </View>
                    }
                    <Text variant='headlineLarge'>
                        {event.name}
                    </Text>
                </View>
                <Divider style={styles.divider} />
                <EventDates event={event} />
                <Divider style={styles.divider} />
                <View style={styles.descriptionRow}>
                    <ScrollView style={styles.description}>
                        <Markdown>
                            {event.description ?? ''}
                        </Markdown>
                    </ScrollView>
                    <ActivityEventTotals eventId={eventId} />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.chipsRow}>
                    <EventParticipants eventId={eventId} isAdmin={isAdmin} visibility={event.visibility} participants={event.participants} />
                    <EventAdmins eventId={eventId} isAdmin={isAdmin} admins={event.admins} />
                </View>
                <Divider style={styles.divider} />
                <ActivityGrid eventId={eventId} />
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

export default memo(Event);

const styles = StyleSheet.create({
    loading: {
        margin: 20
    },
    container: {
        flexGrow: 1,
        height: '100%',
        alignItems: 'center'
    },
    scrollView: {
        width: '100%',
    },
    scrollViewContent: {
        alignItems: 'center'
    },
    divider: {
        height: 2,
        width: '80%',
        marginVertical: 8
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#5559',
        backgroundColor: '#DDD8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        flex: 1,
        flexGrow: 1,
        minWidth: '60%',
        height: '100%',
        minHeight: 180
    },
    descriptionRow: {
        flexDirection: 'row',
        width: '75%',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16
    },
    chipsRow: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
        width: '75%',
        flexWrap: 'wrap',
        marginBottom: 16
    },
    row: {
        flexDirection: 'row'
    },
    lockWrapper: {
        marginRight: 12,
        justifyContent: 'center'
    }
});
