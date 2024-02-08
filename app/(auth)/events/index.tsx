import EventsWelcome from '@/components/event/EventsWelcome';
import LogoutButton from '@/components/user/LogoutButton';
import { Event, useFindEventsQuery } from '@/state/redux/api/wildEventsApi';
import { format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, List, Searchbar, Text, Tooltip } from 'react-native-paper';

function Events() {
    // Translation
    const { t } = useTranslation();
    // Router
    const router = useRouter();
    // State
    const [page, setPage] = useState(0);
    const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
    // TODO: debounce the search filed to prevent too many requests being sent to the backend
    const [search, setSearch] = useState('');
    // Redux
    const { data, isLoading, isFetching } = useFindEventsQuery({ page });
    useEffect(() => {
        console.log('processing fetched events...', 'page:', page, 'data length:', data?.data?.length, 'events in list:', fetchedEvents.length)
        setFetchedEvents((prevFetchedEvents) => {
            const newFetchedEvents = [...prevFetchedEvents];
            for (let newEvent of (data?.data ?? [])) {
                let containsAlready = false;
                for (let oldEvent of prevFetchedEvents) {
                    if (oldEvent.id === newEvent.id) {
                        containsAlready = true;
                        break;
                    }
                }
                if (!containsAlready) {
                    newFetchedEvents.push(newEvent);
                }
            }
            return newFetchedEvents;
        });
    }, [data, setFetchedEvents]);
    // Search
    // TODO: Search on backend, not frontend
    const events = !search ? fetchedEvents : fetchedEvents.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase())
        || event.description?.toLowerCase().includes(search.toLowerCase()));
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.navBar}>
            <LogoutButton />
            <Searchbar value={search} onChangeText={setSearch} placeholder={t('search')} />
        </View>
    ), []);
    // RENDER
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: (isLoading || isFetching) ? t('loading') : t('eventsNavTitle'),
                headerRight: navBarActions
            }} />
            <EventsWelcome />
            {(isLoading || isFetching) &&
                <ActivityIndicator size='large' animating={true} style={styles.loading} />
            }
            <FlatList style={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading || isFetching}
                        onRefresh={useCallback(() => setPage(0), [setPage])}
                    />
                }
                onEndReachedThreshold={0.3}
                onEndReached={useCallback(() => {
                    if (!isFetching && !isLoading) {
                        if (!data?.lastPage && (data && (data.pageSize ?? 0) * page < (data.totalRecords ?? 0))) {
                            console.log('page:', page, 'next:', (page + 1), 'last:', data?.lastPage, 'total:', data.totalRecords)
                            setPage(page + 1);
                        }
                        else {
                            console.log('all pages fetched:', page, 'total fetched:', fetchedEvents.length, 'last:', data?.lastPage, 'total:', data?.totalRecords)
                        }
                    }
                    else {
                        console.log('already loading new pages')
                    }
                }, [page, setPage, isFetching, isLoading, data?.totalRecords])}
                // getItemCount={() => pagedEvents?.totalRecords ?? 0}
                data={events}
                keyExtractor={useCallback((item: Event) => item.id, [])}
                renderItem={useCallback(({ item }: ListRenderItemInfo<Event>) => (
                    <List.Item
                        key={item.id}
                        title={<Text variant='headlineLarge' style={{ borderBottomWidth: 1, borderBottomColor: '#585' }}>{item.name}</Text>}
                        description={<Markdown>{item.description ?? ''}</Markdown>}
                        left={props => <List.Icon {...props} icon='barley' />}
                        right={() => (
                            <View style={{ gap: 5 }}>
                                <Tooltip title={t('eventCardStartDate')}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon source='calendar-arrow-right' size={20} />
                                        <Text> {format(item.start, 'yyyy-MM-dd')}</Text>
                                    </View>
                                </Tooltip>
                                <Tooltip title={t('eventCardStopDate')}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon source='calendar-arrow-left' size={20} />
                                        <Text> {format(item.stop, 'yyyy-MM-dd')}</Text>
                                    </View>
                                </Tooltip>
                                <Tooltip title={t('eventCardCloseDate')}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon source='calendar-edit' size={20} />
                                        <Text> {format(item.close, 'yyyy-MM-dd')}</Text>
                                    </View>
                                </Tooltip>
                            </View>
                        )}
                        // TODO: Make this a callback somehow?
                        onPress={() => router.push(`/events/${item.id}`)}
                        style={{ borderWidth: 1, borderRadius: 10, borderColor: '#555', margin: 10 }}
                    />
                ), [router])}
            />
        </SafeAreaView >
    );
}

export default memo(Events);

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
        marginHorizontal: 4
    },
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
