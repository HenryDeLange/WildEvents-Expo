import { Stack } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import EventCard from '../../../components/event/EventCard';
import CreateEventButton from '../../../components/event/buttons/CreateEventButton';
import ThemedSafeAreaView from '../../../components/ui/ThemedSafeAreaView';
import LogoutButton from '../../../components/user/buttons/LogoutButton';
import { Event, useFindEventsQuery } from '../../../state/redux/api/wildEventsApi';

function Events() {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    // State
    const [page, setPage] = useState(0);
    const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
    // Redux
    const { data: events, isLoading, isFetching } = useFindEventsQuery({ page });
    useEffect(() => {
        // console.log('processing fetched events...', 'page:', page, 'data length:', data?.data?.length, 'events in list:', fetchedEvents.length)
        setFetchedEvents((prevFetchedEvents) => {
            const newFetchedEvents = [...prevFetchedEvents];
            for (let newEvent of (events?.data ?? [])) {
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
    }, [events, setFetchedEvents]);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.navBar}>
            <LogoutButton />
        </View>
    ), []);
    const navBar = useMemo(() => ({
        title: isFetching ? t('loading') : t('eventsNavTitle'),
        headerRight: navBarActions
    }), [t, isFetching, navBarActions]);
    // RENDER
    const gridSize = (width > 800) ? (width > 1200) ? 3 : 2 : 1;
    return (
        <ThemedSafeAreaView style={styles.container}>
            <Stack.Screen options={navBar} />
            <View style={styles.actionWrapper}>
                <Text variant='titleLarge' style={styles.text}>
                    {t('welcomeAction')}
                </Text>
                <View style={styles.createWrapper}>
                    <CreateEventButton />
                </View>
            </View>
            {isLoading &&
                <ActivityIndicator size='large' animating={true} style={styles.loading} />
            }
            <FlatList style={styles.list}
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
                        if (!events?.lastPage && (events && (events.pageSize ?? 0) * page < (events.totalRecords ?? 0))) {
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
                }, [page, setPage, isFetching, isLoading, events?.totalRecords])}
                data={isLoading ? [] : fetchedEvents}
                keyExtractor={useCallback((event: Event) => event.id, [])}
                renderItem={useCallback(({ item: event }: ListRenderItemInfo<Event>) => <EventCard event={event} />, [])}
            />
        </ThemedSafeAreaView>
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
    loading: {
        margin: 30
    },
    container: {
        flexGrow: 1,
        height: '100%',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        marginBottom: 4
    },
    actionWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12
    },
    createWrapper: {
        marginHorizontal: 20
    },
    list: {
        width: '100%'
    }
});
