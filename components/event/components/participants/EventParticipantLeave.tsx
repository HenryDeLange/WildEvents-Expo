import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, Text } from 'react-native-paper';
import { useParticipantLeaveEventMutation } from '../../../../state/redux/api/wildEventsApi';
import ResponsiveCardWrapper from '../../../ui/ResponsiveCardWrapper';

type Props = {
    eventId: string;
    userInaturalistName: string;
    participantName: string;
    modalVisible: boolean;
    hideModal: () => void;
    isAdmin: boolean;
}

function EventParticipantLeave({ eventId, userInaturalistName, participantName, modalVisible, hideModal, isAdmin }: Readonly<Props>) {
    const { t } = useTranslation();
    const [doLeave, { isLoading: isLeaving, isError: isLeaveError, isSuccess: isLeft }] = useParticipantLeaveEventMutation();
    const handleLeave = useCallback(() => {
        doLeave({
            eventId: eventId,
            iNatId: participantName
        });
    }, [participantName]);
    const handleHideModal = useCallback(() => {
        if (!isLeaving)
            hideModal();
    }, [isLeaving, hideModal]);
    useEffect(() => {
        if (isLeft && !isLeaveError)
            hideModal();
    }, [isLeft, isLeaveError, hideModal]);
    if (!modalVisible)
        return null;
    if (!isAdmin && participantName !== userInaturalistName)
        return null;
    return (
        < ResponsiveCardWrapper modalVisible={modalVisible} hideModal={handleHideModal}>
            <Dialog.Title>{t('eventParticipantLeaveTitle')}</Dialog.Title>
            <Dialog.Content style={styles.content}>
                <Text variant='bodyMedium'>
                    {t('eventParticipantLeaveMessage', { participant: participantName })}
                </Text>
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon='check'
                        disabled={isLeaving}
                        loading={isLeaving}
                        onPress={handleLeave}
                    >
                        {t('confirm')}
                    </Button>
                    {isLeaveError &&
                        <HelperText type='error' visible={isLeaveError}>
                            {t('eventParticipantLeaveError')}
                        </HelperText>
                    }
                </View>
            </Dialog.Content>
        </ResponsiveCardWrapper>
    );
}

export default memo(EventParticipantLeave);

const styles = StyleSheet.create({
    content: {
        gap: 12
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    }
});
