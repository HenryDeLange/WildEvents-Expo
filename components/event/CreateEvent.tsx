import { Event, useCreateEventMutation } from '@/state/redux/api/wildEventsApi';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

function CreateEvent() {
    // Translation
    const { t } = useTranslation();
    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<Event['visibility']>('PUBLIC');
    const [startDate, setStartDate] = useState<CalendarDate>();
    const [stopDate, setStopDate] = useState<CalendarDate>();
    const [closeDate, setCloseDate] = useState('');

    const [open, setOpen] = useState(false);

    const onDismiss = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = useCallback((params: { startDate: CalendarDate, endDate: CalendarDate }) => {
            setOpen(false);
            setStartDate(params.startDate);
            setStopDate(params.endDate);
        },
        [setOpen, setStartDate, setStopDate]
    );

    // Redux
    const [doCreate, { isLoading: isCreating, isError, isSuccess }] = useCreateEventMutation();
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating) {
            setModalVisible(false);
            setName('');
            setDescription('');
            setVisibility('PUBLIC');
            setStartDate(undefined);
            setStopDate(undefined);
            setCloseDate('');
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
                start: startDate?.getDate().toString() ?? '',
                stop: stopDate?.getDate().toString() ?? '',
                close: closeDate
            }
        });
    }, [doCreate, name, description, visibility, startDate, stopDate, closeDate]);
    const toggleVisibility = useCallback(() => setVisibility(visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'), [visibility, setVisibility]);
    const renderVisibilityToggle = useCallback(() =>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text onPress={toggleVisibility}>
                {t(`eventVisibility${visibility}`)}
            </Text>
            <IconButton
                icon={visibility === 'PRIVATE' ? 'lock' : 'lock-open-outline'}
                onPress={toggleVisibility}
                animated
                selected={visibility === 'PRIVATE'}
            />
        </View>, [visibility, toggleVisibility]);

    // Validation
    const nameError = name.length === 0;
    // RENDER
    return (
        <>
            <FAB icon={isCreating ? 'loading' : 'plus'} style={styles.floatingButton}
                disabled={isCreating}
                onPress={handleFloatButton}
            />
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title title={t('eventCardCreateTitle')} titleVariant='titleMedium' right={renderVisibilityToggle} />
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
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                        <Button onPress={() => setOpen(true)} uppercase={false} mode='outlined'>
                            TODO: show range and button to edit
                        </Button>
                        <DatePickerModal
                            locale='en' // TODO: Use the active i18next language
                            mode='range'
                            visible={open}
                            onDismiss={onDismiss}
                            startDate={startDate}
                            endDate={stopDate}
                            onConfirm={onConfirm}
                            // startYear={}
                            // endYear={}
                        />
                    </View>
                    
                    <div>
                        TODO: Close date
                    </div>

                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isCreating ? undefined : 'check'}
                            disabled={isCreating || nameError}
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
    floatingButton: {
        position: 'absolute',
        margin: 16,
        right: 16,
        top: 62
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
