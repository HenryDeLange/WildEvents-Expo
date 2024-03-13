import { memo, useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Dialog, HelperText, Icon, Text, Tooltip, useTheme } from 'react-native-paper';
import { EventBase, User, useParticipantJoinEventMutation, useParticipantLeaveEventMutation } from '../../state/redux/api/wildEventsApi';
import { selectAuthINaturalist } from '../../state/redux/auth/authSlice';
import { useAppSelector } from '../../state/redux/hooks';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';
import Inaturalist from '../user/fields/Inaturalist';

type Props = {
    eventId: string;
    isAdmin: boolean;
    visibility: EventBase['visibility'];
    participants?: string[];
}

function EventParticipants({ eventId, isAdmin, visibility, participants }: Readonly<Props>) {
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
    const handleJoinButton = useCallback(() => {
        setParticipantName('');
        setShowJoinDialog(true);
    }, []);
    const handleJoin = useCallback((data: User) => {
        doJoin({
            eventId: eventId,
            iNatId: data.inaturalist
        });
    }, [participantName]);
    useEffect(() => {
        if (isJoined && !isJoinError)
            setShowJoinDialog(false);
    }, [isJoined, isJoinError]);

    const { control, handleSubmit } = useForm<User>();
    const inaturalistInput = useWatch({ control, name: 'inaturalist' });
    useEffect(() => {
        setParticipantName(inaturalistInput);
    }, [inaturalistInput, setParticipantName]);

    // RENDER
    return (
        <View style={styles.wrapper}>
            {/* Participant Chips */}
            <View style={styles.row}>
                <Text variant='titleMedium' style={styles.title}>
                    {t('eventParticipants')}
                </Text>
                {visibility === 'PRIVATE' &&
                    <View style={styles.lockWrapper}>
                        <Tooltip title={t(`eventVisibilityPRIVATE`)}>
                            <Icon source='lock' size={18} />
                        </Tooltip>
                    </View>
                }
            </View>
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
                <Dialog.Content style={styles.content}>
                    <Text variant='bodyMedium'>
                        {t('eventParticipantJoinMessage')}
                    </Text>
                    <Inaturalist
                        control={control}
                        isLoading={!isAdmin || isJoining}
                        autoFocus
                        onEnterKeyPress={isJoining ? undefined : handleSubmit(handleJoin)}
                    />
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isJoining ? undefined : 'check'}
                            disabled={isJoining || !participantName || participantName.trim().length === 0}
                            onPress={handleSubmit(handleJoin)}
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
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    },
    content: {
        gap: 12
    },
    title: {
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row'
    },
    lockWrapper: {
        marginLeft: 8,
        justifyContent: 'center'
    }
});

export default memo(EventParticipants);
