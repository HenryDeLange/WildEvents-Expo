import { ActivityCalculation, ActivityStepResult } from '@/state/redux/api/wildEventsApi';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';
import { generateScoreList, generateScoreMap } from './utils';
import { Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

type Props = {
    results?: ActivityStepResult[];
}

function ActivityStepScoreboard({ results }: Props) {
    const { t } = useTranslation();
    const totalScores = useMemo<ParticipantScore[]>(() => {
        const scoreMap = new Map<string, ActivityCalculation>();
        generateScoreMap(scoreMap, results);
        return generateScoreList(scoreMap);
    }, [results]);
    return (
        <>
            <Text variant='titleMedium'>
                {t('activityTotalScores')}
            </Text>
            <View>
                {(totalScores && totalScores.length > 0)
                    ? totalScores.slice(0, 10).map((participant, index) => (
                        <ActivityParticipantScore key={participant.name} participant={participant} />
                    ))
                    : <Text>{t('eventTotalCalculateScores')}</Text>
                }
            </View>
        </>
    );
}

export default memo(ActivityStepScoreboard);
