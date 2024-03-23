import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, HelperText, Text } from 'react-native-paper';
import { useAdminLeaveEventMutation } from '../../../state/redux/api/wildEventsApi';
import ResponsiveCardWrapper from '../../ui/ResponsiveCardWrapper';

type Props = {
    eventId: string;
    adminName: string;
    modalVisible: boolean;
    hideModal: () => void;
    isAdmin: boolean;
}

function EventAdminLeave({ eventId, adminName, modalVisible, hideModal, isAdmin }: Readonly<Props>) {
    const { t } = useTranslation();
    const [doLeave, { isLoading: isLeaving, isError: isLeaveError, isSuccess: isLeft }] = useAdminLeaveEventMutation();
    const handleLeave = useCallback(() => {
        if (adminName && adminName.trim().length > 0)
            doLeave({
                eventId: eventId,
                adminId: adminName
            });
    }, [adminName]);
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
    if (!isAdmin)
        return null;
    return (
        < ResponsiveCardWrapper modalVisible={modalVisible} hideModal={handleHideModal}>
            <Dialog.Title>{t('eventAdminLeaveTitle')}</Dialog.Title>
            <Dialog.Content style={styles.content}>
                <Text variant='bodyMedium'>
                    {t('eventAdminLeaveMessage', { admin: adminName })}
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
                            {t('eventAdminLeaveError')}
                        </HelperText>
                    }
                </View>
            </Dialog.Content>
        </ResponsiveCardWrapper>
    );
}

export default memo(EventAdminLeave);

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
