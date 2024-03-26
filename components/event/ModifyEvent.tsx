import { memo, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText } from 'react-native-paper';
import { EventBase, useCreateEventMutation, useFindEventQuery, useUpdateEventMutation } from '../../state/redux/api/wildEventsApi';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';
import CloseDate from './fields/dates/CloseDate';
import Description from './fields/Description';
import Name from './fields/Name';
import StartDate from './fields/dates/StartDate';
import StopDate from './fields/dates/StopDate';
import Visibility from './fields/Visibility';

type Props = {
    modalVisible: boolean;
    hideModal: () => void;
    eventId?: string;
}

function ModifyEvent({ modalVisible, hideModal, eventId }: Readonly<Props>) {
    const { t } = useTranslation();
    // Queries
    const { data: event, isFetching: isFetchingFind, isSuccess: isSuccessFind } = useFindEventQuery({ eventId: eventId ?? '_new_' }, { skip: !eventId });
    const [doCreate, { isLoading: isCreating, isError: isErrorCreate, isSuccess: isSuccessCreate }] = useCreateEventMutation();
    const [doUpdate, { isLoading: isUpdating, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] = useUpdateEventMutation();
    const isBusyModifying = isCreating || isUpdating;
    // Form
    const { control, handleSubmit, formState: { isValid }, setValue } = useForm<EventBase>({ mode: 'onChange' });
    useEffect(() => {
        if (isSuccessFind && event) {
            setValue('name', event.name);
            setValue('description', event.description);
            setValue('visibility', event.visibility);
            setValue('start', event.start);
            setValue('stop', event.stop);
            setValue('close', event.close);
        }
    }, [event, isSuccessFind, setValue]);
    const handleConfirm = useCallback<SubmitHandler<EventBase>>((eventBase) => {
        if (eventId)
            doUpdate({ eventId, eventBase });
        else
            doCreate({ eventBase });
    }, [doCreate, doUpdate, eventId]);
    // Modal
    const dismissModal = useCallback(() => {
        if (!isBusyModifying)
            hideModal();
    }, [isBusyModifying, hideModal]);
    useEffect(() => {
        if (isSuccessCreate || isSuccessUpdate)
            hideModal();
    }, [isSuccessCreate, isSuccessUpdate, hideModal]);
    // RENDER
    if (eventId && isFetchingFind)
        return <ActivityIndicator size='small' animating={true} />
    return (
        <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={dismissModal}>
            <Card.Title titleVariant='titleLarge'
                title={eventId ? t('eventCardEditTitle') : t('eventCardCreateTitle')}
                right={() =>
                    <Visibility control={control} isLoading={isBusyModifying} />
                }
            />
            <Card.Content style={styles.content}>
                <Name control={control} isLoading={isBusyModifying} />
                <Description control={control} isLoading={isBusyModifying} />
                <View style={styles.datesWrapper}>
                    <StartDate control={control} isLoading={isBusyModifying} />
                    <StopDate control={control} isLoading={isBusyModifying} />
                    <CloseDate control={control} isLoading={isBusyModifying} />
                </View>
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon='check'
                        disabled={isBusyModifying || !isValid}
                        loading={isBusyModifying}
                        onPress={handleSubmit(handleConfirm)}
                    >
                        {t('confirm')}
                    </Button>
                    {(isErrorCreate || isErrorUpdate) &&
                        <HelperText type='error' visible={isErrorCreate || isErrorUpdate} >
                            {t('eventCardCreateFailed')}
                        </HelperText>
                    }
                </View>
            </Card.Content>
        </ResponsiveCardWrapper>
    );
}

export default memo(ModifyEvent);

const styles = StyleSheet.create({
    content: {
        gap: 12
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    },
    datesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 12,
        columnGap: 28
    }
});
