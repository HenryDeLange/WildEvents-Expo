import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ActivityCalculation } from '../../../state/redux/api/wildEventsApi';
import { ExternalLink } from '../../ui/ExternalLink';

export type ParticipantScore = ActivityCalculation & {
    name: string;
}

type Props = {
    participant: ParticipantScore;
    rank?: number;
}

function ActivityParticipantScore({ participant, rank }: Props) {
    return (
        <View key={participant.name} style={styles.row}>
            {rank &&
                <Text variant={rank ? 'bodyLarge' : 'bodyMedium'} style={styles.rank}>
                    {`${rank})`}
                </Text>
            }
            <Text variant={rank ? 'bodyLarge' : 'bodyMedium'} style={styles.score}>
                {participant.score}
            </Text>
            {(participant.observations && participant.observations.length > 0)
                ? <ExternalLink
                    key={participant.name}
                    href={`https://www.inaturalist.org/observations?id=${participant.observations?.toString()}`}
                >
                    <Text variant={rank ? 'bodyLarge' : 'bodyMedium'}>
                        {participant.name}
                    </Text>
                </ExternalLink>
                : <Text variant={rank ? 'bodyLarge' : 'bodyMedium'} key={participant.name}>
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
        gap: 4,
        marginVertical: 2,
        marginHorizontal: 12
    },
    rank: {
        marginRight: -8
    },
    score: {
        textAlign: 'right',
        marginHorizontal: 2,
        width: 20
    }
});
