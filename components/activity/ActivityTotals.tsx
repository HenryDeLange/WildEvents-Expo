import { ActivityCalculation, useFindActivitiesQuery } from '@/state/redux/api/wildEventsApi';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { generateScoreList, generateScoreMap } from '.';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';

type Props = {
    eventId: string;
}

function ActivityTotals({ eventId }: Readonly<Props>) {
    const { t } = useTranslation();
    const { data, isFetching, refetch } = useFindActivitiesQuery({ eventId });
    const totalScores = useMemo<ParticipantScore[]>(() => {
        const calcTotals = new Map<string, ActivityCalculation>();
        for (let activity of data ?? []) {
            generateScoreMap(calcTotals, activity.results);
        }
        return generateScoreList(calcTotals);
    }, [data]);
    return (
        <View style={styles.wrapper}>
            <Text variant='titleLarge' style={styles.title}>
                {t('eventTotalTitle')}
            </Text>
            {isFetching &&
                <ActivityIndicator size='small' />
            }
            <ScrollView>
                {(!isFetching && totalScores && totalScores.length > 0)
                    ? totalScores.map(participant => <ActivityParticipantScore key={participant.name} participant={participant} />)
                    : !isFetching && <Text> {t('eventTotalCalculateScores')}</Text>
                }
            </ScrollView>
        </View>
    );
}

export default memo(ActivityTotals);

const styles = StyleSheet.create({
    wrapper: {
        height: '100%'
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    }
});
