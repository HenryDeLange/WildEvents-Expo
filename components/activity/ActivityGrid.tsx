import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useFindActivitiesQuery } from '../../state/redux/api/wildEventsApi';
import { useIsEventAdmin } from '../event/utils/hooks';
import ActivityCard from './ActivityCard';
import CreateActivityButton from './buttons/CreateActivityButton';

// TODO: Get this from backend settings via an endpoint
const MAX_ACTIVITIES = 5;

type Props = {
    eventId: string;
}

function ActivityGrid({ eventId }: Readonly<Props>) {
    const { t } = useTranslation();
    const isAdmin = useIsEventAdmin(eventId);
    const { data: activities, isFetching: isActivitiesFetching } = useFindActivitiesQuery({ eventId });
    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Text variant='headlineMedium'>
                    {t('eventActivities')}
                </Text>
                {(isAdmin && activities && activities.length < MAX_ACTIVITIES) &&
                    <CreateActivityButton eventId={eventId} />
                }
            </View>
            {isActivitiesFetching &&
                <ActivityIndicator size='small' />
            }
            {!isActivitiesFetching &&
                <View style={styles.grid}>
                    {activities?.map(activity =>
                        <ActivityCard key={activity.id} activity={activity} />
                    )}
                </View>
            }
        </View>
    );
}

export default memo(ActivityGrid);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 8,
        paddingBottom: '5%'
    },
    heading: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
});
