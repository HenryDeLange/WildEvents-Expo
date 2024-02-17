import { ActivityStep, ActivityStepResult } from '@/state/redux/api/wildEventsApi';
import Markdown from 'markdown-to-jsx';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';
import { generateStepScoreList } from './utils';

type Props = {
    steps?: ActivityStep[];
    results?: ActivityStepResult[];
}

function ActivityStepScores({ steps, results }: Props) {
    const { t } = useTranslation();
    const finalStepResults = new Map<string, ParticipantScore[]>();
    for (let step of steps ?? []) {
        for (let stepResults of results ?? []) {
            if (step.id === stepResults.stepId) {
                finalStepResults.set(step.id, generateStepScoreList(stepResults));
                break;
            }
        }
    }
    return (
        <>
            <Text variant='titleLarge' style={styles.title}>
                {t('activitySteps')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap', marginHorizontal: 32, flex: 1, width: '100%', justifyContent: 'center' }}>
                {steps?.map((step, index) => (
                    <View key={index} style={styles.card}>
                        <Text variant='titleMedium' style={styles.stepTitle}>
                            {t('activityCardStepCount', { step: index + 1 })}
                        </Text>
                        <ScrollView style={styles.description}>
                            <Markdown>
                                {step.description ?? ''}
                            </Markdown>
                        </ScrollView>
                        <Text variant='titleSmall' style={{ marginVertical: 4 }}>
                            Scores
                        </Text>
                        <ScrollView style={styles.scoresScroll}>
                            {finalStepResults.get(step.id)?.map(participantScore => (
                                <ActivityParticipantScore key={participantScore.name} participant={participantScore} />
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </View>
        </>
    );
}

export default memo(ActivityStepScores);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#ABA3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        minWidth: 150,
        width: '35%',
        maxWidth: 350
    },
    title: {
        marginBottom: 12
    },
    stepTitle: {
        alignSelf: 'center',
        marginBottom: 8
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#EFD8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        // flex: 1,
        // height: '100%'
    },
    scoresScroll: {
        maxHeight: 200
    }
});
