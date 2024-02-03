import CreateEvent from '@/components/event/CreateEvent';
import LogoutButton from '@/components/user/LogoutButton';
import { useFindEventsQuery } from '@/state/redux/api/wildEventsApi';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, List, TextInput } from 'react-native-paper';

export default function Safes() {
    // Translation
    const { t } = useTranslation();
    // Router
    const router = useRouter();
    // State
    const [search, setSearch] = useState('');
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
    // Redux
    const { data: pagedEvents, isFetching, refetch } = useFindEventsQuery({ page: 1 });
    // Actions
    const handleEditDismiss = useCallback(() => setSelectedRecordId(null), [setSelectedRecordId]);
    // Search
    const events = !search ? pagedEvents?.data : pagedEvents?.data?.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase())
        || event.description?.toLowerCase().includes(search.toLowerCase()));
    // NavBar
    const navBarActions = useCallback(() => <LogoutButton />, []);
    // RENDER
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: isFetching ? t('loading') : t('eventsNavTitle'),
                headerRight: navBarActions
            }} />
            <TextInput
                style={styles.search}
                mode='flat'
                value={search}
                onChangeText={setSearch}
                left={<TextInput.Icon icon='magnify' />}
            />
            {isFetching &&
                <ActivityIndicator size='large' animating={true} style={styles.loading} />
            }
            <ScrollView style={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                    />
                }
            >
                {events?.map(event => (
                    <List.Item
                        key={event.id}
                        title={event.name}
                        description={event.description}
                        left={props => <List.Icon {...props} icon='safe-square-outline' />}
                        // TODO: Make this a callback somehow?
                        onPress={() => router.push(`/events/${event.id}`)}
                    />
                ))}
            </ScrollView>
            <CreateEvent />
            {/* {selectedRecordId &&
                <EditRecordModal safeId={safeId} recordId={selectedRecordId} onDismiss={handleEditDismiss} />
            } */}
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
    }
});
