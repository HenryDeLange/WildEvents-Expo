import { format } from 'date-fns';
import { memo, useCallback, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { DatePickerModal, enGB, registerTranslation } from 'react-native-paper-dates';
import { CalendarDate, ValidRangeType } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { EventBase } from '../../../state/redux/api/wildEventsApi';

registerTranslation('en-GB', enGB);

type Props = {
    control: Control<EventBase, any>;
    isLoading?: boolean;
    name: 'start' | 'stop' | 'close';
    label: string;
    requiredMessage: string;
    startYear: number;
    endYear: number;
    validRange: ValidRangeType;
    overlap: (value: string) => string | undefined;
}

function GenericDate({ control, isLoading, name, label, requiredMessage, startYear, endYear, validRange, overlap }: Readonly<Props>) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [focussed, setFocussed] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const showDatePicker = useCallback(() => setShowPopup(true), [setShowPopup]);
    const hideDatePicker = useCallback(() => setShowPopup(false), [setShowPopup]);
    const handleDateChange = useCallback((onChange: (value: string | undefined) => void) => (params: { date: CalendarDate }) => {
        hideDatePicker();
        onChange(params.date ? format(params.date, 'yyyy-MM-dd') : undefined);
    }, [hideDatePicker]);
    return (
        <Controller control={control}
            name={name}
            disabled={isLoading}
            rules={{
                required: t(requiredMessage),
                validate: { overlap }
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t(label)}
                        left={<TextInput.Icon icon='calendar-edit' focusable={false} disabled={true} />}
                        right={
                            <TextInput.Icon
                                icon={focussed ? 'calendar-search' : 'calendar-blank'}
                                color={focussed ? theme.colors.primary : undefined}
                                onPress={showDatePicker}
                                disabled={disabled}
                                animated
                            />
                        }
                        mode='outlined'
                        autoComplete='off'
                        disabled={disabled}
                        value={value}
                        readOnly
                        onFocus={useCallback(() => {
                            setFocussed(true)
                        }, [setFocussed])}
                        onBlur={useCallback(() => {
                            setFocussed(false);
                            onBlur();
                        }, [setFocussed, onBlur])}
                    />
                    <DatePickerModal
                        locale='en-GB'
                        label={t(label)}
                        saveLabel={t('confirm').toUpperCase()}
                        mode='single'
                        animationType='fade'
                        inputEnabled={!disabled}
                        startYear={startYear}
                        endYear={endYear}
                        validRange={validRange}
                        visible={showPopup}
                        onDismiss={hideDatePicker}
                        date={value ? new Date(value) : undefined}
                        onConfirm={handleDateChange(onChange)}
                    />
                    {!!error &&
                        <HelperText type='error'>
                            {error.message}
                        </HelperText>
                    }
                </View>
            )}
        />
    );
}

export default memo(GenericDate);
