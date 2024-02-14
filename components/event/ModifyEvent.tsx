import { Event, useCreateEventMutation, useUpdateEventMutation } from '@/state/redux/api/wildEventsApi';
import { addDays, addMonths, getYear, isAfter, subDays } from 'date-fns';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { DatePickerInput, ca, registerTranslation } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

registerTranslation('ca', ca);

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
        setName(event ? event.name : '');
        setDescription(event ? event.description : undefined);
        setVisibility(event ? event.visibility : 'PUBLIC');
        setStartDate(event ? new Date(event.start) : undefined);
        setStopDate(event ? new Date(event.stop) : undefined);
        setCloseDate(event ? new Date(event.close) : undefined);
    }, [event]);
    // Redux
    const [doCreate, { isLoading: isCreating, isError: isErrorCreate, isSuccess: isSuccessCreate }] = useCreateEventMutation();
    const [doUpdate, { isLoading: isUpdating, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] = useUpdateEventMutation();
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating && !isUpdating)
            setModalVisible(false);
    }, [isCreating, isUpdating]);
    useEffect(() => {
        if (isSuccessCreate || isSuccessUpdate)
            hideModal();
    }, [isSuccessCreate, isSuccessUpdate]);
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
        < View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text onPress={toggleVisibility}>
                {t(`eventVisibility${visibility}`)}
            </Text>
            <IconButton
                icon={visibility === 'PRIVATE' ? 'lock' : 'lock-open-outline'}
                onPress={toggleVisibility}
                animated
                selected={visibility === 'PRIVATE'}
            />
        </View >
    ), [visibility]);
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
            <Button mode={event ? 'text' : 'contained-tonal'} style={styles.addButton} uppercase
                icon={(isCreating || isUpdating) ? 'loading' : event ? 'pencil' : 'plus'}
                onPress={handleShowButton}
            >
                {(isCreating || isUpdating) ? <ActivityIndicator animating={true} /> :
                    event ? t('eventCardEditTitle') : t('eventCardCreateTitle')}
            </Button>
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title titleVariant='titleLarge' right={renderVisibilityToggle}
                    title={event ? t('eventCardEditTitle') : t('eventCardCreateTitle')}
                />
                <Card.Content style={styles.content}>
                    <TextInput
                        mode='outlined'
                        label={t('eventCardName')}
                        value={name}
                        onChangeText={setName}
                        left={<TextInput.Icon icon='tag' focusable={false} disabled />}
                        autoFocus
                    />
                    <TextInput
                        mode='outlined'
                        label={t('eventCardDescription')}
                        value={description}
                        onChangeText={setDescription}
                        left={<TextInput.Icon icon='information' focusable={false} disabled />}
                        multiline
                        numberOfLines={3}
                    />
                    <DatePickerInput
                        locale='ca'
                        label={t('eventCardStartDate')}
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
                        locale='ca'
                        label={t('eventCardStopDate')}
                        saveLabel={t('confirm')}
                        left={<TextInput.Icon icon='calendar-arrow-left' focusable={false} disabled />}
                        value={stopDate}
                        onChange={setStopDate}
                        inputMode='start'
                        mode='outlined'
                        animationType='fade'
                        disabled={!startDate}
                        validRange={{ startDate: addDays(startDate ?? '', 1), endDate: addMonths(startDate ?? '', 6) }}
                        startYear={getYear(addDays(startDate ?? '', 1))}
                        endYear={getYear(addMonths(startDate ?? '', 6))}
                        // TODO: Because it seems broken in the current version
                        hideValidationErrors
                        onValidationError={useCallback(() => setStopDate(undefined), [setStopDate])}
                    />
                    <DatePickerInput
                        locale='ca'
                        label={t('eventCardCloseDate')}
                        saveLabel={t('confirm')}
                        left={<TextInput.Icon icon='calendar-edit' focusable={false} disabled />}
                        value={closeDate}
                        onChange={setCloseDate}
                        inputMode='start'
                        mode='outlined'
                        animationType='fade'
                        disabled={!startDate || !stopDate}
                        validRange={{ startDate: addDays(stopDate ?? '', 1), endDate: addMonths(stopDate ?? '', 2) }}
                        startYear={getYear(addDays(stopDate ?? '', 1))}
                        endYear={getYear(addMonths(stopDate ?? '', 2))}
                        // TODO: Because it seems broken in the current version
                        hideValidationErrors
                        onValidationError={useCallback(() => setCloseDate(undefined), [setCloseDate])}
                    />
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={(isCreating || isUpdating) ? undefined : 'check'}
                            disabled={isCreating || isUpdating || nameError || dateError}
                            onPress={handleConfirm}
                        >
                            {isCreating ? <ActivityIndicator animating={true} /> : t('confirm')}
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
    addButton: {

    },
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
