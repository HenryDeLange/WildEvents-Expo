import { memo, useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, Text } from 'react-native-paper';
import { User, useAdminJoinEventMutation } from '../../../../state/redux/api/wildEventsApi';
import ResponsiveCardWrapper from '../../../ui/ResponsiveCardWrapper';
import Username from '../../../user/fields/Username';

type Props = {
    eventId: string;
    modalVisible: boolean;
    hideModal: () => void;
    isAdmin: boolean;
}

function EventAdminJoin({ eventId, modalVisible, hideModal, isAdmin }: Readonly<Props>) {
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm<User>({ defaultValues: { username: '' } });
    const adminName = useWatch({ control, name: 'username' });
    const [doJoin, { isLoading: isJoining, isError: isJoinError, isSuccess: isJoined }] = useAdminJoinEventMutation();
    const handleJoin = useCallback(() => {
        doJoin({
            eventId: eventId,
            adminId: adminName
        });
    }, [adminName]);
    const handleHideModal = useCallback(() => {
        if (!isJoining)
            hideModal();
    }, [isJoining, hideModal]);
    useEffect(() => {
        if (isJoined && !isJoinError)
            hideModal();
    }, [isJoined, isJoinError, hideModal]);
    if (!modalVisible)
        return null;
    if (!isAdmin)
        return null;
    return (
        <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={handleHideModal}>
            <Dialog.Title>{t('eventAdminJoinTitle')}</Dialog.Title>
            <Dialog.Content style={styles.content}>
                {isAdmin &&
                    <>
                        <Text variant='bodyMedium'>
                            {t('eventAdminJoinMessage')}
                        </Text>
                        <Username
                            control={control}
                            isLoading={!isAdmin || isJoining}
                            onEnterKeyPress={isJoining ? undefined : handleSubmit(handleJoin)}
                        />
                    </>
                }
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon='check'
                        disabled={isJoining || !adminName || adminName.trim().length === 0}
                        loading={isJoining}
                        onPress={handleSubmit(handleJoin)}
                    >
                        {t('confirm')}
                    </Button>
                    {isJoinError &&
                        <HelperText type='error' visible={isJoinError} >
                            {t('eventAdminJoinError')}
                        </HelperText>
                    }
                </View>
            </Dialog.Content>
        </ResponsiveCardWrapper>
    );
}

export default memo(EventAdminJoin);

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
