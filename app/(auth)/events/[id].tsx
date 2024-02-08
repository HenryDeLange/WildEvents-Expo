import CreateActivity from '@/components/activity/CreateActivity';
import LogoutButton from '@/components/user/LogoutButton';
import { useFindActivitiesQuery, useFindEventQuery } from '@/state/redux/api/wildEventsApi';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, Icon, List, Text, TextInput, Tooltip } from 'react-native-paper';

function Event() {
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    // State

    // Redux
    const { data: event, isFetching: isEventFetching } = useFindEventQuery({ id: eventId });
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
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: (isEventFetching || isActivitiesFetching) ? t('loading') : event?.name,
                headerRight: navBarActions
            }} />
            <Text variant='titleLarge'>
                {event?.name}
            </Text>
            <Markdown>
                {event?.description ?? ''}
            </Markdown>
            <Divider />
            <View style={{ gap: 5 }}>
                <Tooltip title={t('eventCardStartDate')}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source='calendar-arrow-right' size={20} />
                        <Text> {format(event?.start ?? 0, 'yyyy-MM-dd')}</Text>
                    </View>
                </Tooltip>
                <Tooltip title={t('eventCardStopDate')}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source='calendar-arrow-left' size={20} />
                        <Text> {format(event?.stop ?? 0, 'yyyy-MM-dd')}</Text>
                    </View>
                </Tooltip>
                <Tooltip title={t('eventCardCloseDate')}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source='calendar-edit' size={20} />
                        <Text> {format(event?.close ?? 0, 'yyyy-MM-dd')}</Text>
                    </View>
                </Tooltip>
            </View>
            <View>
                <Text variant='headlineMedium'>
                    Admins
                </Text>
                <Text>
                    {event?.admins}
                </Text>
            </View>
            <View>
                <Text variant='headlineMedium'>
                    Participants
                </Text>
                <Text>
                    {event?.participants}
                </Text>
            </View>
            <View>
                <Text variant='headlineMedium'>
                    Activities
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
