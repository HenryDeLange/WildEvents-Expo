import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Chip, Icon, Text, useTheme } from 'react-native-paper';
import { EventBase } from '../../../../state/redux/api/wildEventsApi';
import { selectAuthINaturalist } from '../../../../state/redux/auth/authSlice';
import { useAppSelector } from '../../../../state/redux/hooks';
import EventVisibilityIcon from '../EventVisibilityIcon';
import EventParticipantJoin from './EventParticipantJoin';
import EventParticipantLeave from './EventParticipantLeave';

type Props = {
    eventId: string;
    isAdmin: boolean;
    visibility: EventBase['visibility'];
    participants?: string[];
}

function EventParticipants({ eventId, isAdmin, visibility, participants }: Readonly<Props>) {
    const { t } = useTranslation();
    const theme = useTheme();
    const currentUserInaturalistName = useAppSelector(selectAuthINaturalist) ?? '';
    const [participantName, setParticipantName] = useState('');
    // Leave
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const hideLeaveModal = useCallback(() => setLeaveModalVisible(false), [setLeaveModalVisible]);
    const handleShowLeaveDialog = useCallback((participant: string) =>
        (isAdmin || participant === currentUserInaturalistName)
            ? () => {
                setParticipantName(participant);
                setLeaveModalVisible(true);
            }
            : undefined
        , [isAdmin, currentUserInaturalistName]);
    // Join
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const hideJoinModal = useCallback(() => setJoinModalVisible(false), [setJoinModalVisible]);
    const handleShowJoinDialog = useCallback(() => {
        setParticipantName(isAdmin ? '' : currentUserInaturalistName)
        setJoinModalVisible(true);
    }, [isAdmin, currentUserInaturalistName]);
    // RENDER
    const userIsParticipant = participants && participants.indexOf(currentUserInaturalistName) >= 0;
    return (
        <View style={styles.wrapper}>
            <View style={styles.row}>
                <Text variant='titleMedium' style={styles.title}>
                    {t('eventParticipants')}
                </Text>
                {visibility === 'PRIVATE' &&
                    <EventVisibilityIcon visibility={visibility} size={18} />
                }
            </View>
            <View style={styles.chipWrapper}>
                {participants?.map(participant =>
                    <Chip key={participant} mode='outlined'
                        onClose={handleShowLeaveDialog(participant)}
                    >
                        {participant}
                    </Chip>
                )}
                {(isAdmin || !userIsParticipant) &&
                    <Chip key='add' mode='outlined'
                        onPress={handleShowJoinDialog}
                    >
                        <Icon source='plus' size={18} color={theme.colors.primary} />
                    </Chip>
                }
            </View>
            <EventParticipantLeave
                eventId={eventId}
                userInaturalistName={currentUserInaturalistName}
                participantName={participantName}
                modalVisible={leaveModalVisible}
                hideModal={hideLeaveModal}
                isAdmin={isAdmin}
            />
            <EventParticipantJoin
                eventId={eventId}
                participantName={participantName}
                setParticipantName={setParticipantName}
                modalVisible={joinModalVisible}
                hideModal={hideJoinModal}
                isAdmin={isAdmin}
                userIsParticipant={userIsParticipant ?? false}
            />
        </View >
    );
}

export default memo(EventParticipants);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center'
    },
    chipWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 8
    },
    title: {
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row'
    }
});
