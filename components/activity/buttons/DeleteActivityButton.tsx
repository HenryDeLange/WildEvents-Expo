import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Text } from 'react-native-paper';
import { useDeleteActivityMutation, useFindActivityQuery } from '../../../state/redux/api/wildEventsApi';
import { setActivityIsDeleting } from '../../../state/redux/app/appSlice';
import { useAppDispatch } from '../../../state/redux/hooks';
import HeaderActionButton from '../../ui/HeaderActionButton';
import ResponsiveCardWrapper from '../../ui/ResponsiveCardWrapper';

type Props = {
    eventId: string;
    activityId: string;
}

function DeleteActivityButton({ eventId, activityId }: Readonly<Props>) {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Redux
    const [doDelete, { isLoading: isDeleting, isSuccess: isDeleted }] = useDeleteActivityMutation();
    const { activityName } = useFindActivityQuery({ activityId }, {
        selectFromResult: ({ data }) => ({ activityName: data?.name })
    });
    const handleDelete = useCallback(() => doDelete({ activityId }), [activityId]);
    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = useCallback(() => setModalVisible(true), [activityId]);
    const hideModal = useCallback(() => {
        if (!isDeleting)
            setModalVisible(false);
    }, [isDeleting]);
    // Effects
    useEffect(() => {
        if (isDeleted)
            router.navigate(`/events/${eventId}`);
    }, [isDeleted, router]);
    useEffect(() => {
        dispatch(setActivityIsDeleting(isDeleting));
    }, [dispatch, isDeleting]);
    // RENDER
    return (
        <>
            <HeaderActionButton
                textKey='delete'
                icon='trash-can-outline'
                onPress={showModal}
                busy={isDeleting || !activityName}
            />
            {(modalVisible && activityName) &&
                <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                    <Dialog.Title>{t('activityDeleteTitle')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant='bodyMedium'>
                            {t('activityDeleteMessage', { name: activityName })}
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

export default memo(DeleteActivityButton);

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
