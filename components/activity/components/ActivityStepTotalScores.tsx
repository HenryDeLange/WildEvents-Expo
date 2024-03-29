import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ActivityCalculation, ActivityStepResult } from '../../../state/redux/api/wildEventsApi';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';
import { generateScoreList, generateScoreMap } from '../utils';

type Props = {
    results?: ActivityStepResult[];
}

function ActivityStepTotalScores({ results }: Readonly<Props>) {
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
            <View style={styles.row}>
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
    row: {
        flexDirection: 'row',
        columnGap: 24,
        flexWrap: 'wrap',
        marginHorizontal: 32
    },
    scoresScroll: {
        maxHeight: 200
    }
});
