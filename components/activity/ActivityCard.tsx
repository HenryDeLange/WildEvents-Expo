import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import Markdown from 'markdown-to-jsx';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper';
import { Activity } from '../../state/redux/api/wildEventsApi';
import ActivityStepScoreboard from './components/ActivityStepScoreboard';

type Props = {
    activity: Activity;
}

function ActivityCard({ activity }: Readonly<Props>) {
    const theme = useTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const handleView = useCallback((activity: Activity) => () => router.push(`/activities/${activity.id}`), []);
    return (
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
                        {activity.disableReason &&
                            <Text style={{ color: theme.colors.error }}>
                                {t(`activityDisableReason${activity.disableReason}`)}
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
                    <ActivityStepScoreboard results={activity.results} />
                </View>
                {/* TODO: Align the button to the bottom of the card */}
                <View style={styles.buttonRow}>
                    <Button mode='text' icon='eye' uppercase style={styles.button}
                        onPress={handleView(activity)}
                    >
                        {t('view')}
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
}

export default memo(ActivityCard);

const styles = StyleSheet.create({
    card: {
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
        borderColor: '#5559',
        backgroundColor: '#DDD8',
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 4,
        flex: 1,
        minHeight: 120
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
