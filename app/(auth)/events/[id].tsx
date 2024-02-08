import CreateActivity from '@/components/activity/CreateActivity';
import LogoutButton from '@/components/user/LogoutButton';
import { useFindActivitiesQuery, useFindEventQuery } from '@/state/redux/api/wildEventsApi';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Divider, Icon, List, Text, TextInput, Tooltip } from 'react-native-paper';

function Event() {
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    // State

    // Redux
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindEventQuery({ id: eventId });
    const { data: pagedActivities, isFetching: isActivitiesFetching, refetch } = useFindActivitiesQuery({ eventId });
    // Actions

    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {/* <EditSafeButton safeId={eventId} /> */}
            <LogoutButton />
        </View>
    ), []);
    // RENDER
    if (!event || isEventLoading || isEventFetching) {
        return (
            <ActivityIndicator animating={true} />
        );
    }
    return (
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
            <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#555', width: '65%' }}>
                <Markdown>
                    {event.description ?? ''}
                </Markdown>
            </View>
            <Divider style={{ height: 2, width: '50%', marginVertical: 15 }} />
            <View>
                <Text variant='headlineMedium'>
                    {t('eventAdmins')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {event.admins.map(admin => <Chip key={admin} mode='outlined'>{admin}</Chip>)}
                </View>
            </View>
            <Divider style={{ height: 2, width: '50%', marginVertical: 15 }} />
            <View>
                <Text variant='headlineMedium'>
                    {t('eventParticipants')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {event.participants?.map(participant => <Chip key={participant} mode='outlined'>{participant}</Chip>)}
                </View>
            </View>
            <Divider style={{ height: 2, width: '70%', marginVertical: 15 }} />
            <View>
                <Text variant='headlineMedium'>
                    {t('eventActivities')}
                </Text>
                <ScrollView style={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={isActivitiesFetching}
                            onRefresh={refetch}
                        />
                    }
                >
                    {pagedActivities?.data?.map(activity => (
                        <List.Item
                            key={activity.id}
                            title={activity.name}
                            description={activity.description}
                            left={props => <List.Icon {...props} icon='shield-key-outline' />}
                        // onPress={() => setSelectedRecordId(activity.id)}
                        />
                    ))}
                </ScrollView>
            </View>
            <CreateActivity eventId={eventId} />
        </SafeAreaView>
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
