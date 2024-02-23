import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Divider, Text } from 'react-native-paper';
import ActivityEventTotals from '../../../components/activity/ActivityEventTotals';
import ActivityGrid from '../../../components/activity/ActivityGrid';
import EventAdmins from '../../../components/event/EventAdmins';
import EventDates from '../../../components/event/EventDates';
import EventParticipants from '../../../components/event/EventParticipants';
import ModifyEvent from '../../../components/event/ModifyEvent';
import { useIsEventAdmin } from '../../../components/event/utils/hooks';
import HeaderActionButton from '../../../components/ui/HeaderActionButton';
import ResponsiveCardWrapper from '../../../components/ui/ResponsiveCardWrapper';
import LogoutButton from '../../../components/user/LogoutButton';
import { useCalculateEventMutation, useDeleteEventMutation, useFindEventQuery } from '../../../state/redux/api/wildEventsApi';

function Event() {
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const eventId = id.toString();
    const router = useRouter();
    // Redux
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindEventQuery({ eventId });
    const [doCalculateEvent, { isLoading: isCalculating }] = useCalculateEventMutation();
    const [doDelete, { isLoading: isDeleting, isSuccess: isDeleted }] = useDeleteEventMutation();
    // State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    // Permissions
    const isAdmin = useIsEventAdmin(eventId);
    // Actions
    const handleCalculateEvent = useCallback(() => doCalculateEvent({ eventId }), [eventId]);
    const handleDeleteButton = useCallback(() => setShowDeleteDialog(true), [eventId]);
    const handleDelete = useCallback(() => doDelete({ eventId }), [eventId]);
    const handleHideDeleteDialog = useCallback(() => {
        if (!isDeleting)
            setShowDeleteDialog(false);
    }, [isDeleting]);
    // Effects
    useEffect(() => {
        if (isDeleted)
            router.navigate('/events');
    }, [isDeleted, router]);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {isAdmin &&
                <>
                    <HeaderActionButton
                        textKey='eventCalculate'
                        icon='calculator-variant-outline'
                        onPress={handleCalculateEvent}
                        busy={isCalculating}
                    />
                    <ModifyEvent event={event} />
                    <HeaderActionButton
                        textKey='delete'
                        icon='trash-can-outline'
                        onPress={handleDeleteButton}
                        busy={isDeleting}
                    />
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, event, isCalculating]);
    const navBar = useMemo(() => ({
        title: isEventFetching ? t('loading') : t('eventNavTitle'),
        headerRight: navBarActions
    }), [t, isEventFetching, navBarActions]);
    // RENDER
    if (!event || isEventLoading || isEventFetching) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={navBar} />
                <ActivityIndicator animating={true} size='large' style={{ margin: 20 }} />
            </SafeAreaView>
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
                    <ActivityEventTotals eventId={eventId} />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.chipsRow}>
                    <EventParticipants eventId={eventId} isAdmin={isAdmin} participants={event.participants} />
                    <EventAdmins eventId={eventId} isAdmin={isAdmin} admins={event.admins} />
                </View>
                <Divider style={styles.divider} />
                <ActivityGrid eventId={eventId} />
                {/* Delete Dialog */}
                <ResponsiveCardWrapper modalVisible={showDeleteDialog} hideModal={handleHideDeleteDialog}>
                    <Dialog.Title>{t('eventDeleteTitle')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant='bodyMedium'>
                            {t('eventDeleteMessage', { name: event.name })}
                        </Text>
                        <View style={styles.buttonWrapper}>
                            <Button mode='contained' style={styles.button} uppercase
                                icon={'trash-can-outline'}
                                loading={isDeleting}
                                disabled={isDeleting}
                                onPress={handleDelete}
                            >
                                {t('delete')}
                            </Button>
                        </View>
                    </Dialog.Content>
                </ResponsiveCardWrapper>
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
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    }
});
