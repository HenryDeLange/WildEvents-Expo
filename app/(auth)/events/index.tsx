import EventsWelcome from '@/components/event/EventsWelcome';
import LogoutButton from '@/components/user/LogoutButton';
import { Event, useFindEventsQuery } from '@/state/redux/api/wildEventsApi';
import { format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Button, Divider, Icon, List, Searchbar, Text, Tooltip } from 'react-native-paper';

function Events() {
    // UI
    const { width } = useWindowDimensions();
    // Translation
    const { t } = useTranslation();
    // Router
    const router = useRouter();
    // State
    const [page, setPage] = useState(0);
    const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
    // TODO: debounce the search filed to prevent too many requests being sent to the backend
    // const [search, setSearch] = useState('');
    // Redux
    const { data, isLoading, isFetching } = useFindEventsQuery({ page });
    useEffect(() => {
        // console.log('processing fetched events...', 'page:', page, 'data length:', data?.data?.length, 'events in list:', fetchedEvents.length)
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
    const events = fetchedEvents;
    // const events = !search ? fetchedEvents : fetchedEvents.filter(event =>
    //     event.name.toLowerCase().includes(search.toLowerCase())
    //     || event.description?.toLowerCase().includes(search.toLowerCase()));
    // Actions
    const handleView = useCallback((event: Event) => () => router.push(`/events/${event.id}`), []);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.navBar}>
            {/* <Searchbar value={search} onChangeText={setSearch} placeholder={t('search')} /> */}
            <LogoutButton />
        </View>
    ), []);
    // RENDER
    const gridSize = (width > 800) ? (width > 1200) ? 3 : 2 : 1;
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
            <FlatList style={{ width: '100%' }}
                key={gridSize}
                numColumns={gridSize}
                columnWrapperStyle={gridSize > 1 ? { justifyContent: 'center' } : undefined}
                horizontal={false}
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
                            // console.log('page:', page, 'next:', (page + 1), 'last:', data?.lastPage, 'total:', data.totalRecords)
                            setPage(page + 1);
                        }
                        // else {
                        //     console.log('all pages fetched:', page, 'total fetched:', fetchedEvents.length, 'last:', data?.lastPage, 'total:', data?.totalRecords)
                        // }
                    }
                    // else {
                    //     console.log('already loading new pages')
                    // }
                }, [page, setPage, isFetching, isLoading, data?.totalRecords])}
                // getItemCount={() => pagedEvents?.totalRecords ?? 0}
                data={events}
                keyExtractor={useCallback((event: Event) => event.id, [])}
                renderItem={useCallback(({ item: event }: ListRenderItemInfo<Event>) => (
                    <View key={event.id} style={styles.card} >
                        <Text variant='headlineLarge'>
                            {event.name}
                        </Text>
                        <View>
                            <View style={{ flexDirection: 'row', gap: 12, marginVertical: 8 }}>
                                <Tooltip title={t('eventCardStartDate')}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon source='calendar-arrow-right' size={20} />
                                        <Text> {format(event.start, 'yyyy-MM-dd')}</Text>
                                    </View>
                                </Tooltip>
                                <Tooltip title={t('eventCardStopDate')}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon source='calendar-arrow-left' size={20} />
                                        <Text> {format(event.stop, 'yyyy-MM-dd')}</Text>
                                    </View>
                                </Tooltip>
                                <Tooltip title={t('eventCardCloseDate')}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon source='calendar-edit' size={20} />
                                        <Text> {format(event.close, 'yyyy-MM-dd')}</Text>
                                    </View>
                                </Tooltip>
                            </View>
                            <ScrollView style={styles.description}>
                                <Markdown>{event.description ?? ''}</Markdown>
                            </ScrollView>
                            <Divider style={{ width: '100%', marginVertical: 8 }} />
                            {/* TODO: Justify button to the bottom */}
                            <Button mode='text' icon='eye' uppercase
                                onPress={handleView(event)}
                            >
                                {t('view')}
                            </Button>
                        </View>
                    </View>
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
    card: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#555',
        margin: 10,
        padding: 12,
        alignItems: 'center',
        gap: 6,
        maxWidth: 400
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#EFD8',
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 4
    }
});
