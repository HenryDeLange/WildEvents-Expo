import ActivityGrid from '@/components/activity/ActivityGrid';
import ActivityTotals from '@/components/activity/ActivityTotals';
import EventAdmins from '@/components/event/EventAdmins';
import EventDates from '@/components/event/EventDates';
import EventParticipants from '@/components/event/EventParticipants';
import ModifyEvent from '@/components/event/ModifyEvent';
import LogoutButton from '@/components/user/LogoutButton';
import { useCalculateEventMutation, useFindEventQuery } from '@/state/redux/api/wildEventsApi';
import { selectAuthUsername } from '@/state/redux/auth/authSlice';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

function Event() {
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    // Redux
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindEventQuery({ eventId });
    const [doCalculateEvent, { isLoading: isCalculating }] = useCalculateEventMutation();
    // Permissions
    const username = useSelector(selectAuthUsername);
    const isAdmin = !!event && event.admins.indexOf(username ?? '') >= 0;
    // Actions
    const handleCalculateEvent = useCallback(() => doCalculateEvent({ eventId }), [eventId]);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {isAdmin &&
                <>
                    <Button mode='text' icon='calculator-variant-outline' uppercase
                        onPress={handleCalculateEvent}
                        loading={isCalculating}
                        disabled={isCalculating}
                    >
                        {t('eventCalculate')}
                    </Button>
                    <ModifyEvent event={event} />
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, event, isCalculating]);
    const navBar = useMemo(() => ({
        title: isEventFetching ? t('loading') : event?.name,
        headerRight: navBarActions
    }), [isEventFetching, event?.name, navBarActions]);
    // RENDER
    if (!event || isEventLoading || isEventFetching) {
        return (
            <ActivityIndicator animating={true} size='large' style={{ margin: 20 }} />
        );
    }
    return (
        <ScrollView style={styles.scrollView}>
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={navBar} />
                <Text variant='headlineLarge'>
                    {event.name}
                </Text>
                <Divider style={styles.divider} />
                <EventDates event={event} />
                <Divider style={styles.divider} />
                {/* TODO: Fix wrapping to new line on mobile screens (the row doesn't seem to grow, resulting in overlapped components) */}
                <View style={styles.descriptionRow}>
                    <ScrollView style={styles.description}>
                        <Markdown>
                            {event.description ?? ''}
                        </Markdown>
                    </ScrollView>
                    <ActivityTotals eventId={eventId} />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.chipsRow}>
                    <EventParticipants eventId={eventId} isAdmin={isAdmin} participants={event.participants} />
                    <EventAdmins eventId={eventId} isAdmin={isAdmin} admins={event.admins} />
                </View>
                <Divider style={styles.divider} />
                <ActivityGrid eventId={eventId} />
            </SafeAreaView>
        </ScrollView>
    );
}

export default memo(Event);

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        padding: 8
    },
    container: {
        flexGrow: 1,
        height: '100%',
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
        borderColor: '#ABA',
        backgroundColor: '#EFD8',
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 4,
        flex: 1,
        minWidth: '50%',
        height: '100%'
    },
    descriptionRow: {
        flex: 1,
        flexDirection: 'row',
        width: '75%',
        flexWrap: 'wrap',
        gap: 16,
        minHeight: 220
    },
    chipsRow: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
        width: '75%',
        flexWrap: 'wrap'
    },
    actions: {
        flexDirection: 'row'
    }
});
