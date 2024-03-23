import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Text } from 'react-native-paper';
import { useDeleteEventMutation, useFindEventQuery } from '../../../state/redux/api/wildEventsApi';
import { setEventIsDeleting } from '../../../state/redux/app/appSlice';
import { useAppDispatch } from '../../../state/redux/hooks';
import HeaderActionButton from '../../ui/HeaderActionButton';
import ResponsiveCardWrapper from '../../ui/ResponsiveCardWrapper';

type Props = {
    eventId: string;
}

function DeleteEventButton({ eventId }: Readonly<Props>) {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    // 
    const [doDelete, { isLoading: isDeleting, isSuccess: isDeleted }] = useDeleteEventMutation();
    const { eventName } = useFindEventQuery({ eventId }, {
        selectFromResult: ({ data }) => ({ eventName: data?.name })
    });
    const handleDelete = useCallback(() => doDelete({ eventId }), [eventId]);
    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = useCallback(() => setModalVisible(true), [eventId]);
    const hideModal = useCallback(() => {
        if (!isDeleting)
            setModalVisible(false);
    }, [isDeleting]);
    // Effects
    useEffect(() => {
        if (isDeleted)
            router.navigate('/events');
    }, [isDeleted, router]);
    useEffect(() => {
        dispatch(setEventIsDeleting(isDeleting));
    }, [dispatch, isDeleting]);
    // RENDER
    return (
        <>
            <HeaderActionButton
                textKey='delete'
                icon='trash-can-outline'
                onPress={showModal}
                busy={isDeleting || !eventName}
            />
            {(modalVisible && eventName) &&
                <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                    <Dialog.Title>{t('eventDeleteTitle')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant='bodyMedium'>
                            {t('eventDeleteMessage', { name: eventName })}
                        </Text>
                        <View style={styles.buttonWrapper}>
                            <Button mode='contained' style={styles.button} uppercase
                                icon={'trash-can-outline'}
                                loading={isDeleting}
                                disabled={isDeleting}
                                onPress={handleDelete}
                            >
                                {t('delete')}
                            </Button>
                        </View>
                    </Dialog.Content>
                </ResponsiveCardWrapper>
            }
        </>
    );
}

export default memo(DeleteEventButton);

const styles = StyleSheet.create({
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    }
});
