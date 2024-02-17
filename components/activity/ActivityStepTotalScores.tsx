import { ActivityCalculation, ActivityStepResult } from '@/state/redux/api/wildEventsApi';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { generateScoreList, generateScoreMap } from './utils';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';

type Props = {
    results?: ActivityStepResult[];
}

function ActivityStepTotalScores({ results }: Props) {
    const { t } = useTranslation();
    const totalScores = useMemo<ParticipantScore[]>(() => {
        const scoreMap = new Map<string, ActivityCalculation>();
        generateScoreMap(scoreMap, results);
        return generateScoreList(scoreMap);
    }, [results]);
    return (
        <>
            <Text variant='titleLarge' style={styles.title}>
                {t('activityTotalScores')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap', marginHorizontal: 32 }}>
                {(totalScores && totalScores.length > 0)
                    ? totalScores.map((participant, index) => (
                        <ActivityParticipantScore key={participant.name} participant={participant} rank={index + 1} />
                    ))
                    : <Text>{t('eventTotalCalculateScores')}</Text>
                }
            </View>
        </>
    );
}

export default memo(ActivityStepTotalScores);

const styles = StyleSheet.create({
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
