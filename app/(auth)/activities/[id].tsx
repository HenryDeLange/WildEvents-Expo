import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, Text, useTheme } from 'react-native-paper';
import CalculateActivityButton from '../../../components/activity/buttons/CalculateActivityButton';
import DeleteActivityButton from '../../../components/activity/buttons/DeleteActivityButton';
import EditActivityButton from '../../../components/activity/buttons/EditActivityButton';
import EnableDisableActivityButton from '../../../components/activity/buttons/EnableDisableActivityButton';
import ActivityStepScores from '../../../components/activity/components/ActivityStepScores';
import ActivityStepTotalScores from '../../../components/activity/components/ActivityStepTotalScores';
import { useIsEventAdmin } from '../../../components/event/utils/hooks';
import ThemedSafeAreaView from '../../../components/ui/ThemedSafeAreaView';
import LogoutButton from '../../../components/user/buttons/LogoutButton';
import { useFindActivityQuery } from '../../../state/redux/api/wildEventsApi';

function Activity() {
    // Theme
    const theme = useTheme();
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const activityId = id.toString();
    // Redux
    const { data: activity, isLoading: isActivityLoading, isFetching: isActivityFetching } = useFindActivityQuery({ activityId }, {});
    // Permissions
    const isAdmin = useIsEventAdmin(activity?.eventId ?? null);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {(isAdmin && activity) &&
                <>
                    <CalculateActivityButton activityId={activityId} />
                    <EnableDisableActivityButton activityId={activityId} />
                    <EditActivityButton eventId={activity.eventId} activityId={activityId} />
                    <DeleteActivityButton eventId={activity.eventId} activityId={activityId} />
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, activityId, activity?.eventId]);
    const navBar = useMemo(() => ({
        title: (isActivityFetching) ? t('loading') : t('activityNavTitle'),
        headerRight: navBarActions
    }), [t, isActivityFetching, navBarActions]);
    // RENDER
    if (!activity || isActivityLoading) {
        return (
            <ThemedSafeAreaView style={styles.container}>
                <Stack.Screen options={navBar} />
                <ActivityIndicator animating={true} size='large' style={styles.loading} />
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
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

export default memo(Activity);

const styles = StyleSheet.create({
    loading: {
        margin: 20
    },
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
        borderColor: '#5559',
        backgroundColor: '#DDD8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        flex: 1,
        flexGrow: 1,
        minWidth: '80%',
        height: '100%',
        minHeight: 180
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
