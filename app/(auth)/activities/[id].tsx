import ModifyActivity from '@/components/activity/ModifyActivity';
import LogoutButton from '@/components/user/LogoutButton';
import { useCalculateActivityMutation, useFindActivityQuery } from '@/state/redux/api/wildEventsApi';
import { selectAuthUsername } from '@/state/redux/auth/authSlice';
import { Stack, useLocalSearchParams } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

function Activity() {
    // Translation
    const { t } = useTranslation();
    // Router
    const { id } = useLocalSearchParams();
    const activityId = id.toString();
    // Redux
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } = useFindActivityQuery({ id: activityId });
    const [doCalculate, { isLoading: isCalculating }] = useCalculateActivityMutation();
    // Permissions
    const username = useSelector(selectAuthUsername);
    const isAdmin = true; //!!event && event.admins.indexOf(username ?? '') >= 0;
    // Actions
    const handleCalculateEvent = useCallback(() => doCalculate({ id: activityId }), [activityId]);
    // NavBar
    const navBarActions = useCallback(() => (
        <View style={styles.actions}>
            {isAdmin &&
                <>
                    <Button mode='text' icon='calculator-variant-outline' uppercase
                        onPress={handleCalculateEvent}
                        loading={isCalculating}
                        disabled={isCalculating}
                    >
                        {t('eventCalculate')}
                    </Button>
                    {/* <ModifyActivity eventId={event} /> */}
                </>
            }
            <LogoutButton />
        </View>
    ), [isAdmin, event, isCalculating]);
    const navBar = useMemo(() => ({
        title: isEventFetching ? t('loading') : event?.name,
        headerRight: navBarActions
    }), [isEventFetching, event?.name, navBarActions]);
    // RENDER
    if (!event || isEventLoading || isEventFetching) {
        return (
            <ActivityIndicator animating={true} size='large' style={{ margin: 20 }} />
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

});
