import Markdown from 'markdown-to-jsx';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ActivityStep, ActivityStepResult } from '../../../state/redux/api/wildEventsApi';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';
import { generateStepScoreList } from '../utils';

type Props = {
    steps?: ActivityStep[];
    results?: ActivityStepResult[];
}

function ActivityStepScores({ steps, results }: Readonly<Props>) {
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
                    <Card key={step.id} style={styles.card}>
                        <Text variant='titleMedium' style={styles.stepTitle}>
                            {t('activityCardStepCount', { step: index + 1 })}
                        </Text>
                        <ScrollView style={styles.description}>
                            <Markdown>
                                {step.description ?? ''}
                            </Markdown>
                        </ScrollView>
                        xxx
                        TODO: SHOW CRITERIA
                        xxx
                        <Text variant='titleMedium' style={{ marginVertical: 4 }}>
                            {t('activityScores')}
                        </Text>
                        {finalStepResults.size <= 0 &&
                            <Text>{t('eventTotalCalculateScores')}</Text>
                        }
                        <ScrollView style={styles.scoresScroll}>
                            {finalStepResults.get(step.id)?.map(participantScore => (
                                <ActivityParticipantScore key={participantScore.name} participant={participantScore} />
                            ))}
                        </ScrollView>
                    </Card>
                ))}
            </View>
        </>
    );
}

export default memo(ActivityStepScores);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minWidth: 150,
        width: '35%',
        maxWidth: 350,
        marginHorizontal: 8
    },
    title: {
        marginBottom: 12
    },
    stepTitle: {
        alignSelf: 'center',
        marginBottom: 8,
        fontWeight: 'bold'
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#5559',
        backgroundColor: '#DDD8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        minHeight: 120
    },
    scoresScroll: {
        maxHeight: 200
    }
});
