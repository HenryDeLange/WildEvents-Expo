import { ActivityCalculation } from '@/state/redux/api/wildEventsApi';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ExternalLink } from '../ui/ExternalLink';

export type ParticipantScore = ActivityCalculation & {
    name: string;
}

type Props = {
    participant: ParticipantScore;
}

function ActivityParticipantScore({ participant }: Props) {
    return (
        <View key={participant.name} style={styles.row}>
            <Text style={styles.score}>
                {participant.score}
            </Text>
            {(participant.observations && participant.observations.length > 0)
                ? <ExternalLink
                    key={participant.name}
                    href={`https://www.inaturalist.org/observations?id=${participant.observations?.toString()}`}
                >
                    <Text>
                        {participant.name}
                    </Text>
                </ExternalLink>
                : <Text key={participant.name}>
                    {participant.name}
                </Text>
            }
        </View>
    );
}

export default memo(ActivityParticipantScore);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 2,
        marginHorizontal: 12
    },
    score: {
        textAlign: 'right',
        width: 30
    }
});
