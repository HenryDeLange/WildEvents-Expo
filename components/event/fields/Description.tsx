import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { EventBase } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<EventBase, any>;
    isLoading?: boolean;
}

function Description({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Controller control={control}
            name='description'
            disabled={isLoading}
            rules={{
                required: false
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('eventDescription')}
                        left={<TextInput.Icon icon='information' focusable={false} disabled={true} />}
                        mode='outlined'
                        autoCapitalize='none'
                        autoComplete='off'
                        disabled={disabled}
                        error={!!error}
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        numberOfLines={3}
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

export default Description;
