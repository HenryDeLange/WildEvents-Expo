import { addDays, addMonths, getYear, isAfter, subDays } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { DatePickerInput, enGB, registerTranslation } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { Event, useCreateEventMutation, useUpdateEventMutation } from '../../state/redux/api/wildEventsApi';
import HeaderActionButton from '../ui/HeaderActionButton';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

registerTranslation('en-GB', enGB);

type Props = {
    event?: Event;
}

function ModifyEvent({ event }: Readonly<Props>) {
    // Translation
    const { t } = useTranslation();
    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [visibility, setVisibility] = useState<Event['visibility']>('PUBLIC');
    const [startDate, setStartDate] = useState<CalendarDate>(undefined);
    const [stopDate, setStopDate] = useState<CalendarDate>(undefined);
    const [closeDate, setCloseDate] = useState<CalendarDate>(undefined);
    useEffect(() => {
        if (event) {
            setName(event.name);
            setDescription(event.description);
            setVisibility(event.visibility);
            setStartDate(new Date(event.start));
            setStopDate(new Date(event.stop));
            setCloseDate(new Date(event.close));
        }
    }, [event]);
    // Redux
    const [doCreate, { isLoading: isCreating, isError: isErrorCreate, isSuccess: isSuccessCreate }] = useCreateEventMutation();
    const [doUpdate, { isLoading: isUpdating, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] = useUpdateEventMutation();
    // Memo
    const isDisabled = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating && !isUpdating)
            setModalVisible(false);
    }, [isCreating, isUpdating]);
    useEffect(() => {
        if (isSuccessCreate || isSuccessUpdate)
            hideModal();
        if (isSuccessCreate) {
            setName('');
            setDescription(undefined);
            setVisibility('PUBLIC');
            setStartDate(undefined);
            setStopDate(undefined);
            setCloseDate(undefined);
        }
    }, [isSuccessCreate, isSuccessUpdate, hideModal]);
    const handleShowButton = useCallback(() => setModalVisible(true), []);
    const handleConfirm = useCallback(() => {
        const eventBase = {
            name: name,
            description: description,
            visibility: visibility,
            start: startDate?.toISOString() ?? '',
            stop: stopDate?.toISOString() ?? '',
            close: closeDate?.toISOString() ?? ''
        };
        if (event)
            doUpdate({ eventId: event.id, eventBase })
        else
            doCreate({ eventBase });
    }, [doCreate, doUpdate, name, description, visibility, startDate, stopDate, closeDate, event]);
    const toggleVisibility = useCallback(() => {
        setVisibility(visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE');
    }, [visibility]);
    const renderVisibilityToggle = useCallback(() => (
        <View style={styles.visibility}>
            <Text
                disabled={isDisabled}
                onPress={isDisabled ? undefined : toggleVisibility}
            >
                {t(`eventVisibility${visibility}`)}
            </Text>
            <IconButton
                icon={visibility === 'PRIVATE' ? 'lock' : 'lock-open-outline'}
                disabled={isDisabled}
                onPress={toggleVisibility}
                animated
                selected={visibility === 'PRIVATE'}
            />
        </View >
    ), [visibility, isDisabled]);
    // Validation
    const nameError = name.length === 0;
    const dateError = !startDate || !stopDate || !closeDate || !isAfter(stopDate, startDate) || !isAfter(closeDate, stopDate);
    useEffect(() => {
        if (startDate && stopDate && !isAfter(stopDate, startDate)) {
            setStopDate(undefined);
        }
        if (closeDate && stopDate && !isAfter(closeDate, stopDate)) {
            setCloseDate(undefined);
        }
    }, [startDate, stopDate, closeDate]);
    // RENDER
    const now = new Date();
    return (
        <>
            {event
                ? (
                    <HeaderActionButton
                        textKey={event ? 'edit' : 'eventCardCreateTitle'}
                        icon={event ? 'pencil' : 'plus'}
                        onPress={handleShowButton}
                        busy={isDisabled}
                        mode={event ? 'text' : 'contained-tonal'}
                    />
                )
                : (
                    <Button mode={event ? 'text' : 'contained-tonal'} uppercase
                        icon={event ? 'pencil' : 'plus'}
                        loading={isDisabled}
                        disabled={isDisabled}
                        onPress={handleShowButton}
                    >
                        {event ? t('edit') : t('eventCardCreateTitle')}
                    </Button>
                )}
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title titleVariant='titleLarge' right={renderVisibilityToggle}
                    title={event ? t('eventCardEditTitle') : t('eventCardCreateTitle')}
                />
                <Card.Content style={styles.content}>
                    <TextInput
                        mode='outlined'
                        label={t('eventCardName')}
                        disabled={isDisabled}
                        value={name}
                        onChangeText={setName}
                        left={<TextInput.Icon icon='tag' focusable={false} disabled />}
                        autoFocus
                    />
                    <TextInput
                        mode='outlined'
                        label={t('eventCardDescription')}
                        disabled={isDisabled}
                        value={description}
                        onChangeText={setDescription}
                        left={<TextInput.Icon icon='information' focusable={false} disabled />}
                        multiline
                        numberOfLines={3}
                    />
                    <DatePickerInput
                        locale='en-GB'
                        label={t('eventCardStartDate')}
                        disabled={isDisabled}
                        saveLabel={t('confirm')}
                        left={<TextInput.Icon icon='calendar-arrow-right' focusable={false} disabled />}
                        value={startDate}
                        onChange={setStartDate}
                        inputMode='start'
                        mode='outlined'
                        animationType='fade'
                        validRange={{ startDate: subDays(now, 14), endDate: addMonths(now, 3) }}
                        startYear={getYear(subDays(now, 14))}
                        endYear={getYear(addMonths(now, 3))}
                        // TODO: Because it seems broken in the current version
                        hideValidationErrors
                        onValidationError={useCallback(() => setStartDate(undefined), [setStartDate])}
                    />
                    <DatePickerInput
                        locale='en-GB'
                        label={t('eventCardStopDate')}
                        disabled={isDisabled || !startDate}
                        saveLabel={t('confirm')}
                        left={<TextInput.Icon icon='calendar-arrow-left' focusable={false} disabled />}
                        value={stopDate}
                        onChange={setStopDate}
                        inputMode='start'
                        mode='outlined'
                        animationType='fade'
                        validRange={{ startDate: addDays(startDate ?? '', 1), endDate: addMonths(startDate ?? '', 6) }}
                        startYear={getYear(addDays(startDate ?? '', 1))}
                        endYear={getYear(addMonths(startDate ?? '', 6))}
                        // TODO: Because it seems broken in the current version
                        hideValidationErrors
                        onValidationError={useCallback(() => setStopDate(undefined), [setStopDate])}
                    />
                    <DatePickerInput
                        locale='en-GB'
                        label={t('eventCardCloseDate')}
                        disabled={isDisabled || !startDate || !stopDate}
                        saveLabel={t('confirm')}
                        left={<TextInput.Icon icon='calendar-edit' focusable={false} disabled />}
                        value={closeDate}
                        onChange={setCloseDate}
                        inputMode='start'
                        mode='outlined'
                        animationType='fade'
                        validRange={{ startDate: addDays(stopDate ?? '', 1), endDate: addMonths(stopDate ?? '', 2) }}
                        startYear={getYear(addDays(stopDate ?? '', 1))}
                        endYear={getYear(addMonths(stopDate ?? '', 2))}
                        // TODO: Because it seems broken in the current version
                        hideValidationErrors
                        onValidationError={useCallback(() => setCloseDate(undefined), [setCloseDate])}
                    />
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isDisabled ? undefined : 'check'}
                            disabled={isDisabled || nameError || dateError}
                            loading={isDisabled}
                            onPress={handleConfirm}
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
        </>
    );
}

export default memo(ModifyEvent);

const styles = StyleSheet.create({
    visibility: {
        flexDirection: 'row',
        alignItems: 'center'
    },
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
    }
});
