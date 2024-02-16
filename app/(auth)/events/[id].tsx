import ModifyActivity from '@/components/activity/ModifyActivity';
import EventAdmins from '@/components/event/EventAdmins';
import EventDates from '@/components/event/EventDates';
import EventParticipants from '@/components/event/EventParticipants';
import EventTotalScore from '@/components/event/EventTotalScore';
import ModifyEvent from '@/components/event/ModifyEvent';
import LogoutButton from '@/components/user/LogoutButton';
import { Activity, useCalculateActivityMutation, useCalculateEventMutation, useFindActivitiesQuery, useFindEventQuery } from '@/state/redux/api/wildEventsApi';
import { selectAuthUsername } from '@/state/redux/auth/authSlice';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

function Event() {
    // Theme
    const theme = useTheme();
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    // State

    // Redux
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindEventQuery({ eventId });
    const { data: activities, isFetching: isActivitiesFetching, refetch } = useFindActivitiesQuery({ eventId });
    const [doCalculateEvent, { isLoading: isCalculating }] = useCalculateEventMutation();
    const [doCalculateActivity] = useCalculateActivityMutation();
    // Permissions
    const username = useSelector(selectAuthUsername);
    const isAdmin = !!event && event.admins.indexOf(username ?? '') >= 0;
    // Actions
    const handleCalculateEvent = useCallback(() => doCalculateEvent({ eventId }), [eventId]);
    const handleCalculate = useCallback((activity: Activity) => () => doCalculateActivity({ id: activity.id }), []);
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
        title: (isEventFetching || isActivitiesFetching) ? t('loading') : event?.name,
        headerRight: navBarActions
    }), [isEventFetching, isActivitiesFetching, event?.name, navBarActions]);
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
                <View style={styles.descriptionRow}>
                    <ScrollView style={styles.description}>
                        <Markdown>
                            {event.description ?? ''}
                        </Markdown>
                    </ScrollView>
                    <EventTotalScore eventId={eventId} />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.chipsRow}>
                    <EventParticipants eventId={eventId} isAdmin={isAdmin} participants={event.participants} />
                    <EventAdmins eventId={eventId} isAdmin={isAdmin} admins={event.admins} />
                </View>
                <Divider style={styles.divider} />
                <View>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <Text variant='headlineMedium'>
                            {t('eventActivities')}
                        </Text>
                        <View>
                            <ModifyActivity eventId={eventId} />
                        </View>
                    </View>
                    {isActivitiesFetching &&
                        <ActivityIndicator size='small' />
                    }
                    {activities?.map(activity => (
                        <List.Item
                            key={activity.id}
                            title={activity.name}
                            description={
                                <View style={{ gap: 4, width: '100%' }}>
                                    <Markdown>
                                        {activity.description ?? ''}
                                    </Markdown>
                                    <Divider style={{ width: '100%' }} />
                                    <View style={{ flexDirection: 'row', gap: 15 }}>
                                        <Text>
                                            {activity.status}
                                        </Text>
                                        {activity.calculated &&
                                            <Text>
                                                {format(activity.calculated, 'yyyy-MM-dd HH:mm')}
                                            </Text>
                                        }
                                    </View>
                                    <Divider style={{ width: '100%' }} />
                                    {activity.disableReason &&
                                        <>
                                            <Text style={{ color: theme.colors.error }}>
                                                {activity.disableReason}
                                            </Text>
                                            <Divider style={{ width: '100%' }} />
                                        </>
                                    }
                                    {activity.results?.map((stepResult, index) => (
                                        <View key={index}>
                                            <Text variant='bodyLarge'>
                                                {t('activityCardStepCount', { step: index })}
                                            </Text>
                                            <View>
                                                {stepResult.participantScores &&
                                                    // TODO: Sort top score first
                                                    Object.keys(stepResult.participantScores).map(participant => (
                                                        <View style={{ flexDirection: 'row', gap: 6, marginLeft: 20 }}>
                                                            <Text>
                                                                {stepResult.participantScores![participant].score}
                                                            </Text>
                                                            <Text>
                                                                {participant}
                                                            </Text>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            }
                            onPress={() => console.log('x')}
                            style={{ borderWidth: 1, borderRadius: 10, borderColor: '#555', margin: 10 }}
                            right={() => (
                                <Button mode='text' icon='calculator-variant-outline' uppercase
                                    onPress={handleCalculate(activity)}
                                    loading={isCalculating}
                                    disabled={isCalculating}
                                >
                                    {t('eventCalculate')}
                                </Button>
                            )}
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
        borderRadius: 8,
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
        gap: 15,
        width: '75%',
        flexWrap: 'wrap',
        minHeight: 200,
    },
    chipsRow: {
        flex: 1,
        flexDirection: 'row',
        gap: 15,
        width: '75%',
        flexWrap: 'wrap'
    },
    list: {
        width: '100%'
    },
    actions: {
        flexDirection: 'row'
    }
});
