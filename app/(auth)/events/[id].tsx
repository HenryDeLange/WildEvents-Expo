import ModifyActivity from '@/components/activity/ModifyActivity';
import EventAdmins from '@/components/event/EventAdmins';
import EventParticipants from '@/components/event/EventParticipants';
import ModifyEvent from '@/components/event/ModifyEvent';
import LogoutButton from '@/components/user/LogoutButton';
import { useCalculateEventMutation, useFindActivitiesQuery, useFindEventQuery } from '@/state/redux/api/wildEventsApi';
import { selectAuthUsername } from '@/state/redux/auth/authSlice';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Icon, IconButton, List, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

function Event() {
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    // State

    // Redux
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindEventQuery({ eventId });
    const { data: pagedActivities, isFetching: isActivitiesFetching, refetch } = useFindActivitiesQuery({ eventId });
    const [doCalculate, { isLoading: isCalculating }] = useCalculateEventMutation();
    // Permissions
    const username = useSelector(selectAuthUsername);
    const isAdmin = !!event && event.admins.indexOf(username ?? '') >= 0;
    // Actions
    const handleCalculate = useCallback(() => doCalculate({ eventId }), [eventId]);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {isAdmin &&
                <>
                    <Button mode='text' icon='calculator-variant-outline' uppercase
                        onPress={handleCalculate}
                        loading={isCalculating}
                    >
                        {t('eventCalculate')}
                    </Button>
                    <ModifyEvent event={event} />
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, event]);
    // RENDER
    if (!event || isEventLoading || isEventFetching) {
        return (
            <ActivityIndicator animating={true} size='large' style={{ margin: 20 }} />
        );
    }
    return (
        <ScrollView style={{ width: '100%' }}>
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{
                    title: (isEventFetching || isActivitiesFetching) ? t('loading') : event?.name,
                    headerRight: navBarActions
                }} />
                <Text variant='headlineLarge'>
                    {event.name}
                </Text>

                <Divider style={{ height: 2, width: '80%', marginBottom: 15 }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 35 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source='calendar-arrow-right' size={24} />
                        <Text variant='bodyLarge' style={{ fontWeight: 'bold', marginLeft: 5, marginRight: 10 }}>
                            {t('eventCardStartDate')}
                        </Text>
                        <Text variant='bodyLarge'>
                            {format(event.start, 'yyyy-MM-dd')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source='calendar-arrow-left' size={24} />
                        <Text variant='bodyLarge' style={{ fontWeight: 'bold', marginLeft: 5, marginRight: 10 }}>
                            {t('eventCardStopDate')}
                        </Text>
                        <Text variant='bodyLarge'>
                            {format(event.stop, 'yyyy-MM-dd')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source='calendar-edit' size={24} />
                        <Text variant='bodyLarge' style={{ fontWeight: 'bold', marginLeft: 5, marginRight: 10 }}>
                            {t('eventCardCloseDate')}
                        </Text>
                        <Text variant='bodyLarge'>
                            {format(event.close, 'yyyy-MM-dd')}
                        </Text>
                    </View>
                </View>
                <Divider style={{ height: 2, width: '70%', marginVertical: 15 }} />
                <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#ABA', width: '65%', backgroundColor: '#CDC', paddingHorizontal: 12, paddingVertical: 4, opacity: 0.7 }}>
                    <Markdown>
                        {event.description ?? ''}
                    </Markdown>
                </View>
                <Divider style={{ height: 2, width: '50%', marginVertical: 15 }} />
                <EventAdmins eventId={eventId} isAdmin={isAdmin} admins={event.admins} />
                <Divider style={{ height: 2, width: '50%', marginVertical: 15 }} />
                <EventParticipants eventId={eventId} isAdmin={isAdmin} participants={event.participants} />
                <Divider style={{ height: 2, width: '70%', marginVertical: 15 }} />
                <View>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <Text variant='headlineMedium'>
                            {t('eventActivities')}
                        </Text>
                        <View>
                            <ModifyActivity eventId={eventId} />
                        </View>
                    </View>
                    {pagedActivities?.data?.map(activity => (
                        <List.Item
                            key={activity.id}
                            title={activity.name}
                            description={<Markdown>{activity.description ?? ''}</Markdown>}
                            onPress={() => console.log('x')}
                            style={{ borderWidth: 1, borderRadius: 10, borderColor: '#555', margin: 10 }}
                        />
                    ))}
                </View>

            </SafeAreaView>
        </ScrollView>
    );
}

export default memo(Event);

const styles = StyleSheet.create({
    search: {
        width: '100%'
    },
    loading: {
        margin: 30
    },
    container: {
        flexGrow: 1,
        height: '100%',
        alignItems: 'center'
    },
    list: {
        width: '100%'
    },
    actions: {
        flexDirection: 'row'
    }
});
