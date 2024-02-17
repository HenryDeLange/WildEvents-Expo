import ActivityStepScores from '@/components/activity/ActivityStepScores';
import ActivityStepTotalScores from '@/components/activity/ActivityStepTotalScores';
import LogoutButton from '@/components/user/LogoutButton';
import { useCalculateActivityMutation, useFindActivityQuery } from '@/state/redux/api/wildEventsApi';
import { selectAuthUsername } from '@/state/redux/auth/authSlice';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

function Activity() {
    // Theme
    const theme = useTheme();
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const activityId = id.toString();
    // Redux
    const { data: activity, isLoading: isActivityLoading, isFetching: isActivityFetching } = useFindActivityQuery({ id: activityId });
    const [doCalculate, { isLoading: isCalculating }] = useCalculateActivityMutation();
    // Permissions
    // TODO: Do the admin stuff
    const username = useSelector(selectAuthUsername);
    const isAdmin = true; //!!event && event.admins.indexOf(username ?? '') >= 0;
    // Actions
    const handleCalculate = useCallback(() => doCalculate({ id: activityId }), [activityId]);
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
                    {/* TODO: Make editable */}
                    {/* <ModifyActivity eventId={event} /> */}
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, activity, isCalculating]);
    const navBar = useMemo(() => ({
        title: isActivityFetching ? t('loading') : activity?.name,
        headerRight: navBarActions
    }), [isActivityFetching, activity?.name, navBarActions]);
    // RENDER
    if (!activity || isActivityLoading || isActivityFetching) {
        return (
            <ActivityIndicator animating={true} size='large' style={{ margin: 20 }} />
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
                        <Text variant='titleMedium'>
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
    }
});
