import { Event, useCreateEventMutation } from '@/state/redux/api/wildEventsApi';
import { addDays, addMonths, getYear, isAfter, subDays } from 'date-fns';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { DatePickerInput, ca, registerTranslation } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

registerTranslation('ca', ca);

function CreateEvent() {
    // Translation
    const { t } = useTranslation();
    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState<string | undefined>('');
    const [visibility, setVisibility] = useState<Event['visibility']>('PUBLIC');
    const [startDate, setStartDate] = useState<CalendarDate>();
    const [stopDate, setStopDate] = useState<CalendarDate>();
    const [closeDate, setCloseDate] = useState<CalendarDate>();
    // Redux
    const [doCreate, { isLoading: isCreating, isError, isSuccess }] = useCreateEventMutation();
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating) {
            setModalVisible(false);
            setName('');
            setDescription(undefined);
            setVisibility('PUBLIC');
            setStartDate(undefined);
            setStopDate(undefined);
            setCloseDate(undefined);
        }
    }, [isCreating, setModalVisible, setName, setDescription, setVisibility, setStartDate, setStopDate, setCloseDate]);
    useEffect(() => {
        if (isSuccess)
            hideModal();
    }, [isSuccess, hideModal]);
    const handleFloatButton = useCallback(() => setModalVisible(true), [setModalVisible]);
    const handleCreate = useCallback(() => {
        doCreate({
            eventBase: {
                name: name,
                description: description,
                visibility: visibility,
                start: startDate?.toISOString() ?? '',
                stop: stopDate?.toISOString() ?? '',
                close: closeDate?.toISOString() ?? ''
            }
        });
    }, [doCreate, name, description, visibility, startDate, stopDate, closeDate]);
    const toggleVisibility = useCallback(() => setVisibility(visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'), [visibility, setVisibility]);
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
    ), [visibility, toggleVisibility]);
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
    }, [startDate, stopDate, closeDate, setStopDate, setCloseDate]);
    // RENDER
    const now = new Date();
    return (
        <>
            <Button mode='contained-tonal' style={styles.addButton} uppercase
                icon={isCreating ? 'loading' : 'plus'}
                onPress={handleFloatButton}
            >
                {isCreating ? <ActivityIndicator animating={true} /> : t('eventCardCreateTitle')}
            </Button>
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title title={t('eventCardCreateTitle')} titleVariant='titleLarge' right={renderVisibilityToggle} />
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
                            icon={isCreating ? undefined : 'check'}
                            disabled={isCreating || nameError || dateError}
                            onPress={handleCreate}
                        >
                            {isCreating ? <ActivityIndicator animating={true} /> : t('confirm')}
                        </Button>
                        {isError &&
                            <HelperText type='error' visible={isError} >
                                {t('eventCardCreateFailed')}
                            </HelperText>
                        }
                    </View>
                </Card.Content>
            </ResponsiveCardWrapper>
        </>
    );
}

export default memo(CreateEvent);

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
