import { Activity, ActivityCalculation, ActivityStepResult, useFindActivitiesQuery } from '@/state/redux/api/wildEventsApi';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, Text, useTheme } from 'react-native-paper';
import { generateScoreList, generateScoreMap } from '.';
import ActivityParticipantScore, { ParticipantScore } from './ActivityParticipantScore';
import ModifyActivity from './ModifyActivity';

type Props = {
    eventId: string;
}

function ActivityGrid({ eventId }: Props) {
    const theme = useTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const { data: activities, isFetching: isActivitiesFetching, refetch } = useFindActivitiesQuery({ eventId });
    // const [doCalculateActivity, { isLoading: isCalculating }] = useCalculateActivityMutation();
    // const handleCalculate = useCallback((activity: Activity) => () => doCalculateActivity({ id: activity.id }), []);
    const handleView = useCallback((activity: Activity) => () => router.push(`/activities/${activity.id}`), []);
    // RENDER
    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Text variant='headlineMedium'>
                    {t('eventActivities')}
                </Text>
                {(activities && activities.length < 5) &&
                    <ModifyActivity eventId={eventId} />
                }
            </View>
            {isActivitiesFetching &&
                <ActivityIndicator size='small' />
            }
            <View style={styles.grid}>
                {activities?.map(activity => (
                    <Card key={activity.id} style={styles.card}>
                        <Card.Title
                            title={activity.name} titleVariant='titleLarge' titleStyle={styles.title}
                            subtitle={t(`activityType${activity.type}`)} subtitleVariant='bodySmall' subtitleStyle={styles.title}
                        />
                        <Card.Content>
                            <View style={styles.content}>
                                <Divider style={styles.dividerTop} />
                                <View style={styles.statusWrapper}>
                                    <Text style={styles.status}>
                                        {t(`activityStatus${activity.status ?? 'NEW'}`)}
                                    </Text>
                                    {activity.calculated &&
                                        <Text>
                                            {format(activity.calculated, 'yyyy-MM-dd HH:mm')}
                                        </Text>
                                    }
                                </View>
                                <Divider style={styles.divider} />
                                <ScrollView style={styles.description}>
                                    <Markdown>
                                        {activity.description ?? ''}
                                    </Markdown>
                                </ScrollView>
                                <Divider style={styles.divider} />
                                {activity.disableReason &&
                                    <>
                                        <Text style={{ color: theme.colors.error }}>
                                            {activity.disableReason}
                                        </Text>
                                        <Divider style={styles.divider} />
                                    </>
                                }
                                <StepScores results={activity.results} />
                            </View>
                            {/* TODO: Align the button to the bottom of the card */}
                            <View style={styles.buttonRow}>
                                {/* TODO: Only trigger loading animation for the effected activity (not all) */}
                                {/* <Button mode='text' icon='calculator-variant-outline' uppercase
                                    onPress={handleCalculate(activity)}
                                    loading={isCalculating}
                                    disabled={isCalculating}
                                >
                                    {t('eventCalculate')}
                                </Button> */}
                                <Button mode='text' icon='eye' uppercase style={styles.button}
                                    onPress={handleView(activity)}
                                >
                                    {t('view')}
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </View>
    );
}

export default memo(ActivityGrid);

type StepScoresProps = {
    results?: ActivityStepResult[];
}

function StepScores({ results }: StepScoresProps) {
    const { t } = useTranslation();
    const totalScores = useMemo<ParticipantScore[]>(() => {
        const scoreMap = new Map<string, ActivityCalculation>();
        generateScoreMap(scoreMap, results)
        return generateScoreList(scoreMap);
    }, [results]);
    return results?.map((stepResult, index) => (
        <View key={index}>
            <Text variant='bodyLarge'>
                {t('activityCardStepCount', { step: index + 1 })}
            </Text>
            <ScrollView>
                {(totalScores && totalScores.length > 0)
                    ? totalScores.slice(0, 3).map(participant => <ActivityParticipantScore key={participant.name} participant={participant} />)
                    : <Text> {t('eventTotalCalculateScores')}</Text>
                }
            </ScrollView>
        </View>
    ));
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 12,
        paddingBottom: '5%'
    },
    heading: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 8
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    card: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#555',
        margin: 10,
        width: '30%',
        minWidth: 260,
        maxWidth: 320
    },
    title: {
        textAlign: 'center'
    },
    content: {
        gap: 8,
        width: '100%',
        marginBottom: 12,
        flex: 1
    },
    dividerTop: {
        width: '100%',
        marginTop: -12
    },
    divider: {
        width: '100%'
    },
    description: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ABA',
        backgroundColor: '#EFD8',
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 4,
        flex: 1
    },
    statusWrapper: {
        flexDirection: 'row',
        gap: 15
    },
    status: {
        flex: 1
    },
    scoreWrapper: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 20
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center'
    },
    button: {
        flex: 1
    }
});