import ActivityStepScores from '@/components/activity/ActivityStepScores';
import ActivityStepTotalScores from '@/components/activity/ActivityStepTotalScores';
import ModifyActivity from '@/components/activity/ModifyActivity';
import { useIsEventAdmin } from '@/components/event/utils/hooks';
import ResponsiveCardWrapper from '@/components/ui/ResponsiveCardWrapper';
import LogoutButton from '@/components/user/LogoutButton';
import { useCalculateActivityMutation, useDeleteActivityMutation, useFindActivityQuery } from '@/state/redux/api/wildEventsApi';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Divider, Text, useTheme } from 'react-native-paper';

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
    const { data: activity, isLoading: isActivityLoading, isFetching: isActivityFetching } = useFindActivityQuery({ activityId });
    const [doCalculate, { isLoading: isCalculating }] = useCalculateActivityMutation();
    const [doDelete, { isLoading: isDeleting, isSuccess: isDeleted }] = useDeleteActivityMutation();
    // State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    // Permissions
    const isAdmin = useIsEventAdmin(activity?.eventId ?? null);
    // Actions
    const handleCalculate = useCallback(() => doCalculate({ activityId }), [activityId]);
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
                    <Button mode='text' icon='calculator-variant-outline' uppercase
                        onPress={handleCalculate}
                        loading={isCalculating}
                        disabled={isCalculating}
                    >
                        {t('eventCalculate')}
                    </Button>
                    {activity &&
                        <ModifyActivity eventId={activity.eventId} activity={activity} />
                    }
                    <Button mode='text' icon='trash-can-outline' uppercase
                        onPress={handleDeleteButton}
                        loading={isDeleting}
                        disabled={isDeleting}
                    >
                        {t('delete')}
                    </Button>
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, activity, isCalculating]);
    const navBar = useMemo(() => ({
        title: isActivityFetching ? t('loading') : t('activityNavTitle'),
        headerRight: navBarActions
    }), [t, isActivityFetching, navBarActions]);
    // RENDER
    if (!activity || isActivityLoading || isActivityFetching) {
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
                        <>
                            <Text variant='titleLarge' style={{ color: theme.colors.error }}>
                                {activity.disableReason}
                            </Text>
                            <Divider style={styles.divider} />
                        </>
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
            </SafeAreaView>
        </ScrollView>
    );
}

export default memo(Activity);

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row'
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
    statusWrapper: {
        flexDirection: 'row',
        gap: 32,
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
    }
});
