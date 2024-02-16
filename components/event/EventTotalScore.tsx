import { ActivityCalculation, useFindActivitiesQuery } from '@/state/redux/api/wildEventsApi';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { ExternalLink } from '../ui/ExternalLink';

type Props = {
    eventId: string;
}

function EventTotalScore({ eventId }: Readonly<Props>) {
    const { t } = useTranslation();
    const { data, isFetching, refetch } = useFindActivitiesQuery({ eventId });
    const totalScores = useMemo<ParticipantScore[]>(() => {
        const calcTotals = new Map<string, ActivityCalculation>();
        for (let activity of data ?? [])
            for (let result of activity.results ?? [])
                if (result.participantScores)
                    for (let participant of Object.keys(result.participantScores)) {
                        const tempScore = result.participantScores[participant];
                        const tempTotal = calcTotals.get(participant);
                        let total = null;
                        if (tempTotal) {
                            total = { ...tempTotal };
                            total.score = total.score! + (tempScore.score ?? 0);
                            total.observations?.push(...tempScore.observations ?? []);
                        }
                        else {
                            total = {
                                score: tempScore.score ?? 0,
                                observations: [...(tempScore.observations ?? [])]
                            };
                        }
                        calcTotals.set(participant, total);
                    }
        const finalTotals: ParticipantScore[] = [];
        for (let entry of calcTotals)
            finalTotals.push({
                name: entry[0],
                score: entry[1].score,
                observations: entry[1].observations
            });
        finalTotals.sort((a, b) => (b.score! - a.score!));
        return finalTotals;
    }, [data]);
    return (
        <View style={styles.wrapper}>
            <Text variant='titleLarge' style={styles.title}>
                {t('eventTotalTitle')}
            </Text>
            {isFetching &&
                <ActivityIndicator size='small' />
            }
            {(!isFetching && totalScores && totalScores.length > 0)
                ? totalScores.map(participant => (
                    <View key={participant.name} style={styles.row}>
                        <Text>
                            {participant.score}
                        </Text>

                        {(participant.observations && participant.observations.length > 0)
                            ? <ExternalLink href={`https://www.inaturalist.org/observations?id=${participant.observations?.toString()}`}>
                                <Text>
                                    {participant.name}
                                </Text>
                            </ExternalLink>
                            : <Text>
                                {participant.name}
                            </Text>
                        }
                    </View>
                ))
                : <Text>
                    {t('eventTotalCalculateScores')}
                </Text>
            }
        </View>
    );
}

export default memo(EventTotalScore);

type ParticipantScore = ActivityCalculation & {
    name: string;
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 20
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 2
    }
});
