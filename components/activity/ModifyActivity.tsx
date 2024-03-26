import { memo, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText } from 'react-native-paper';
import { ActivityCreate, useCreateActivityMutation, useFindActivityQuery, useUpdateActivityMutation } from '../../state/redux/api/wildEventsApi';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';
import Description from './fields/Description';
import Name from './fields/Name';
import Type from './fields/Type';
import Steps from './fields/steps/Steps';

type Props = {
    modalVisible: boolean;
    hideModal: () => void;
    eventId: string;
    activityId?: string;
}

function ModifyActivity({ modalVisible, hideModal, eventId, activityId }: Readonly<Props>) {
    const { t } = useTranslation();
    // Queries
    const { data: activity, isFetching: isFetchingFind, isSuccess: isSuccessFind } = useFindActivityQuery({ activityId: activityId ?? '_new_' }, { skip: !activityId });
    const [doCreate, { isLoading: isCreating, isError: isErrorCreate, isSuccess: isSuccessCreate }] = useCreateActivityMutation();
    const [doUpdate, { isLoading: isUpdating, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] = useUpdateActivityMutation();
    const isBusyModifying = isCreating || isUpdating;
    // Form
    const { control, handleSubmit, formState: { isValid }, setValue } = useForm<ActivityCreate>({
        mode: 'onChange',
        defaultValues: {
            eventId,
            type: 'RACE',
            steps: [{
                id: '',
                description: '',
                criteria: {}
            }]
        }
    });
    useEffect(() => {
        if (isSuccessFind && activity) {
            setValue('name', activity.name);
            setValue('description', activity.description);
            setValue('type', activity.type);
            setValue('steps', activity.steps);
        }
    }, [eventId, activity, isSuccessFind, setValue]);
    const handleConfirm = useCallback<SubmitHandler<ActivityCreate>>((activityCreate) => {
        if (activity?.id)
            doUpdate({ activityId: activity.id, activityBase: activityCreate })
        else
            doCreate({ activityCreate });
    }, [doCreate, doUpdate, eventId, activity?.id]);
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
                title={activityId ? t('activityCardEditTitle') : t('activityCardCreateTitle')}
            />
            <Card.Content style={styles.content}>
                <Name control={control} loading={isBusyModifying} />
                <Description control={control} loading={isBusyModifying} />
                <Type control={control} loading={isBusyModifying} disabled={isBusyModifying || !!activity} />
                <Steps control={control} loading={isBusyModifying} setValue={setValue} initialType={activity?.type} />
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
                            {t('activityCardCreateFailed')}
                        </HelperText>
                    }
                </View>
            </Card.Content>
        </ResponsiveCardWrapper>
    );
}

export default memo(ModifyActivity);

const styles = StyleSheet.create({
    content: {
        gap: 15
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    }
});
