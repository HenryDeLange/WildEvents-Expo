import { Dispatch, SetStateAction, memo, useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, Text } from 'react-native-paper';
import { User, useParticipantJoinEventMutation } from '../../../../state/redux/api/wildEventsApi';
import ResponsiveCardWrapper from '../../../ui/ResponsiveCardWrapper';
import Inaturalist from '../../../user/fields/Inaturalist';

type Props = {
    eventId: string;
    participantName: string;
    setParticipantName: Dispatch<SetStateAction<string>>;
    modalVisible: boolean;
    hideModal: () => void;
    isAdmin: boolean;
    userIsParticipant: boolean;
}

function EventParticipantJoin({ eventId, participantName, setParticipantName, modalVisible, hideModal, isAdmin, userIsParticipant }: Readonly<Props>) {
    const { t } = useTranslation();
    const [doJoin, { isLoading: isJoining, isError: isJoinError, isSuccess: isJoined }] = useParticipantJoinEventMutation();
    const handleJoin = useCallback((data: User) => {
        doJoin({
            eventId: eventId,
            iNatId: participantName
        });
    }, [participantName]);
    const handleHideModal = useCallback(() => {
        if (!isJoining)
            hideModal();
    }, [isJoining, hideModal]);
    useEffect(() => {
        if (isJoined && !isJoinError)
            hideModal();
    }, [isJoined, isJoinError, hideModal]);
    const { control, handleSubmit } = useForm<User>({ defaultValues: { inaturalist: participantName } });
    const inaturalist = useWatch({ control, name: 'inaturalist' });
    useEffect(() => {
        if (isAdmin) {
            setParticipantName(inaturalist);
        }
    }, [setParticipantName, inaturalist, isAdmin]);
    if (!modalVisible)
        return null;
    if (!isAdmin && userIsParticipant)
        return null;
    return (
        <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={handleHideModal}>
            <Dialog.Title>{t('eventParticipantJoinTitle')}</Dialog.Title>
            <Dialog.Content style={styles.content}>
                {isAdmin
                    ? <>
                        <Text variant='bodyMedium'>
                            {t('eventParticipantJoinMessage')}
                        </Text>
                        <Inaturalist
                            control={control}
                            isLoading={!isAdmin || isJoining}
                            autoFocus
                            onEnterKeyPress={isJoining ? undefined : handleSubmit(handleJoin)}
                        />
                    </>
                    : <Text variant='bodyMedium'>
                        {t('eventParticipantJoinSelfMessage', { participant: participantName })}
                    </Text>
                }
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon='check'
                        disabled={isJoining || !participantName || participantName.trim().length === 0}
                        loading={isJoining}
                        onPress={handleSubmit(handleJoin)}
                    >
                        {t('confirm')}
                    </Button>
                    {isJoinError &&
                        <HelperText type='error' visible={isJoinError} >
                            {t('eventParticipantJoinError')}
                        </HelperText>
                    }
                </View>
            </Dialog.Content>
        </ResponsiveCardWrapper>
    );
}

export default memo(EventParticipantJoin);

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
