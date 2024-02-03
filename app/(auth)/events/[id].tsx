import LogoutButton from '@/components/user/LogoutButton';
import { useFindActivitiesQuery, useFindEventQuery } from '@/state/redux/api/wildEventsApi';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Text, TextInput } from 'react-native-paper';

export default function Safe() {
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
            <Text>
                {event?.name}
            </Text>
            <Markdown>
                {event?.description ?? ''}
            </Markdown>
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
        </SafeAreaView>
    );
}

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
