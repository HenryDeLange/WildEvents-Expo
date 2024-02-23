import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Dialog, HelperText, Icon, Text, TextInput, useTheme } from 'react-native-paper';
import { useParticipantJoinEventMutation, useParticipantLeaveEventMutation } from '../../state/redux/api/wildEventsApi';
import { selectAuthINaturalist } from '../../state/redux/auth/authSlice';
import { useAppSelector } from '../../state/redux/hooks';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

type Props = {
    eventId: string;
    isAdmin: boolean;
    participants?: string[];
}

function EventParticipants({ eventId, isAdmin, participants }: Readonly<Props>) {
    const { t } = useTranslation();
    const theme = useTheme();

    // User's participant iNaturalist username
    const inaturalistName = useAppSelector(selectAuthINaturalist) ?? '';
    // New participant iNaturalist username
    const [participantName, setParticipantName] = useState(isAdmin ? '' : inaturalistName);

    // Leave
    const [doLeave, { isLoading: isLeaving, isError: isLeaveError, isSuccess: isLeft }] = useParticipantLeaveEventMutation();
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const handleHideLeaveDialog = useCallback(() => {
        if (!isLeaving)
            setShowLeaveDialog(false);
    }, [isLeaving]);
    const handleShowLeaveDialog = useCallback((participant: string) => () => {
        setParticipantName(participant);
        setShowLeaveDialog(true);
    }, []);
    const handleLeave = useCallback(() => {
        doLeave({
            eventId: eventId,
            iNatId: participantName
        });
    }, [participantName]);
    useEffect(() => {
        if (isLeft && !isLeaveError)
            setShowLeaveDialog(false);
    }, [isLeft, isLeaveError]);

    // Join
    const [doJoin, { isLoading: isJoining, isError: isJoinError, isSuccess: isJoined }] = useParticipantJoinEventMutation();
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const handleHideJoinDialog = useCallback(() => {
        if (!isJoining)
            setShowJoinDialog(false);
    }, [isJoining]);
    const handleJoinButton = useCallback(() => setShowJoinDialog(true), []);
    const handleJoin = useCallback(() => {
        doJoin({
            eventId: eventId,
            iNatId: participantName
        });
    }, [participantName]);
    const handleJoinEnterKey = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (event.nativeEvent.key === 'Enter')
            handleJoin();
    }, [handleJoin]);
    useEffect(() => {
        if (isJoined && !isJoinError)
            setShowJoinDialog(false);
    }, [isJoined, isJoinError]);
    
    // RENDER
    return (
        <View style={styles.wrapper}>
            {/* Participant Chips */}
            <Text variant='titleMedium' style={styles.title}>
                {t('eventParticipants')}
            </Text>
            <View style={styles.chipWrapper}>
                {participants?.map(participant =>
                    <Chip key={participant} mode='outlined'
                        onClose={(isAdmin || participant === inaturalistName) ? handleShowLeaveDialog(participant) : undefined}
                    >
                        {participant}
                    </Chip>
                )}
                {(isAdmin || (participants && participants.indexOf(inaturalistName) < 0)) &&
                    <Chip key='add' mode='outlined'
                        onPress={handleJoinButton}
                    >
                        <Icon source='plus' size={18} color={theme.colors.primary} />
                    </Chip>
                }
            </View>
            {/* Leave Dialog */}
            <ResponsiveCardWrapper modalVisible={showLeaveDialog} hideModal={handleHideLeaveDialog}>
                <Dialog.Title>{t('eventParticipantLeaveTitle')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant='bodyMedium'>
                        {t('eventParticipantLeaveMessage', { participant: participantName })}
                    </Text>
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isLeaving ? undefined : 'check'}
                            disabled={isLeaving}
                            onPress={handleLeave}
                        >
                            {isLeaving ? <ActivityIndicator animating={true} /> : t('confirm')}
                        </Button>
                        {isLeaveError &&
                            <HelperText type='error' visible={isLeaveError} >
                                {t('eventParticipantLeaveError')}
                            </HelperText>
                        }
                    </View>
                </Dialog.Content>
            </ResponsiveCardWrapper>
            {/* Join Dialog */}
            <ResponsiveCardWrapper modalVisible={showJoinDialog} hideModal={handleHideJoinDialog}>
                <Dialog.Title>{t('eventParticipantJoinTitle')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant='bodyMedium'>
                        {t('eventParticipantJoinMessage')}
                    </Text>
                    <TextInput
                        style={styles.participantName}
                        mode='outlined'
                        label={t('eventParticipantJoinInput')}
                        value={participantName}
                        onChangeText={setParticipantName}
                        autoFocus
                        onKeyPress={handleJoinEnterKey}
                        disabled={!isAdmin}
                    />
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isJoining ? undefined : 'check'}
                            disabled={isJoining || !participantName || participantName.trim().length === 0}
                            onPress={handleJoin}
                        >
                            {isJoining ? <ActivityIndicator animating={true} /> : t('confirm')}
                        </Button>
                        {isJoinError &&
                            <HelperText type='error' visible={isJoinError} >
                                {t('eventParticipantJoinError')}
                            </HelperText>
                        }
                    </View>
                </Dialog.Content>
            </ResponsiveCardWrapper>
        </View>
    );
}

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
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    },
    participantName: {
        marginTop: 15
    },
    title: {
        fontWeight: 'bold'
    }
});

export default memo(EventParticipants);
