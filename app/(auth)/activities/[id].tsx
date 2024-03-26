import { format } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Divider, Text, useTheme } from 'react-native-paper';
import ActivityStepScores from '../../../components/activity/components/ActivityStepScores';
import ActivityStepTotalScores from '../../../components/activity/components/ActivityStepTotalScores';
import EditActivityButton from '../../../components/activity/buttons/EditActivityButton';
import { useIsEventAdmin } from '../../../components/event/utils/hooks';
import HeaderActionButton from '../../../components/ui/HeaderActionButton';
import ResponsiveCardWrapper from '../../../components/ui/ResponsiveCardWrapper';
import ThemedSafeAreaView from '../../../components/ui/ThemedSafeAreaView';
import LogoutButton from '../../../components/user/buttons/LogoutButton';
import { useCalculateActivityMutation, useDeleteActivityMutation, useDisableActivityMutation, useEnableActivityMutation, useFindActivityQuery } from '../../../state/redux/api/wildEventsApi';

function Activity() {
    // Theme
    const theme = useTheme();
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const activityId = id.toString();
    const router = useRouter();
    // Redux
    const { data: activity, isLoading: isActivityLoading, isFetching: isActivityFetching } =
        useFindActivityQuery({ activityId }, {});
    const [doCalculate, { isLoading: isCalculating }] = useCalculateActivityMutation();
    const [doEnable, { isLoading: isEnabling }] = useEnableActivityMutation();
    const [doDisable, { isLoading: isDisabling }] = useDisableActivityMutation();
    const [doDelete, { isLoading: isDeleting, isSuccess: isDeleted }] = useDeleteActivityMutation();
    // State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    // Permissions
    const isAdmin = useIsEventAdmin(activity?.eventId ?? null);
    // Actions
    const handleCalculate = useCallback(() => doCalculate({ activityId }), [activityId]);
    const handleEnable = useCallback(() => doEnable({ activityId }), [activityId]);
    const handleDisable = useCallback(() => doDisable({ activityId }), [activityId]);
    const handleDeleteButton = useCallback(() => setShowDeleteDialog(true), [activityId]);
    const handleDelete = useCallback(() => doDelete({ activityId }), [activityId]);
    const handleHideDeleteDialog = useCallback(() => {
        if (!isDeleting)
            setShowDeleteDialog(false);
    }, [isDeleting]);
    // Effects
    useEffect(() => {
        if (isDeleted)
            router.navigate(`/events/${activity?.eventId}`);
    }, [activity, isDeleted, router]);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {isAdmin &&
                <>
                    <HeaderActionButton
                        icon={activity?.disableReason ? 'check-circle-outline' : 'minus-circle-outline'}
                        textKey={activity?.disableReason ? 'activityEnable' : 'activityDisable'}
                        onPress={activity?.disableReason ? handleEnable : handleDisable}
                        busy={isEnabling || isDisabling}
                    />
                    <HeaderActionButton
                        icon='calculator-variant-outline'
                        textKey='eventCalculate'
                        onPress={handleCalculate}
                        busy={isCalculating}
                        disabled={activity?.disableReason ? true : false}
                    />
                    {activity &&
                        <EditActivityButton eventId={activity.eventId} activityId={activityId} />
                    }
                    <HeaderActionButton
                        icon='trash-can-outline'
                        textKey='delete'
                        onPress={handleDeleteButton}
                        busy={isDeleting}
                    />
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, activity, isCalculating, isEnabling, isDisabling]);
    const navBar = useMemo(() => ({
        title: (isActivityFetching || isEnabling || isDisabling) ? t('loading') : t('activityNavTitle'),
        headerRight: navBarActions
    }), [t, isActivityFetching, navBarActions]);
    // RENDER
    if (!activity || isActivityLoading) {
        return (
            <ThemedSafeAreaView style={styles.container}>
                <Stack.Screen options={navBar} />
                <ActivityIndicator animating={true} size='large' style={{ margin: 20 }} />
            </ThemedSafeAreaView>
        );
    }
    return (
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <Stack.Screen options={navBar} />
                <Text variant='headlineLarge'>
                    {activity.name}
                </Text>
                <Divider style={styles.divider} />
                <View>
                    <View style={styles.statusWrapper}>
                        <Text variant='titleMedium' style={styles.type}>
                            {t(`activityType${activity.type}`)}
                        </Text>
                        <Text variant='titleMedium'>
                            {t(`activityStatus${activity.status ?? 'NEW'}`)}
                        </Text>
                        {activity.calculated &&
                            <Text variant='titleMedium'>
                                {format(activity.calculated, 'yyyy-MM-dd HH:mm')}
                            </Text>
                        }
                    </View>
                    {activity.disableReason &&
                        <View style={styles.disableReason}>
                            <Text variant='titleMedium' style={{ color: theme.colors.error }}>
                                {t(`activityDisableReason${activity.disableReason}`)}
                            </Text>
                        </View>
                    }
                </View>
                <Divider style={styles.divider} />
                <ScrollView style={styles.description}>
                    <Markdown>
                        {activity.description ?? ''}
                    </Markdown>
                </ScrollView>
                <Divider style={styles.divider} />
                <ActivityStepTotalScores results={activity.results} />
                <Divider style={styles.divider} />
                <ActivityStepScores steps={activity.steps} results={activity.results} />
                {/* Delete Dialog */}
                <ResponsiveCardWrapper modalVisible={showDeleteDialog} hideModal={handleHideDeleteDialog}>
                    <Dialog.Title>{t('activityDeleteTitle')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant='bodyMedium'>
                            {t('activityDeleteMessage', { name: activity.name })}
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
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

export default memo(Activity);

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row'
    },
    container: {
        flexGrow: 1,
        height: '100%',
        alignItems: 'center',
    },
    scrollView: {
        width: '100%',
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingBottom: '10%'
    },
    divider: {
        height: 2,
        width: '80%',
        marginVertical: 8
    },
    statusWrapper: {
        flexDirection: 'row',
        columnGap: 32,
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#EFD8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        flex: 1,
        minWidth: '50%',
        height: '100%'
    },
    card: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#ABA3',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    title: {
        marginBottom: 12
    },
    scoresScroll: {
        maxHeight: 200
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    },
    type: {
        fontWeight: 'bold'
    },
    disableReason: {
        alignItems: 'center'
    }
});
