import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { EventBase } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<EventBase, any>;
    isLoading?: boolean;
}

function Name({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Controller control={control}
            name='name'
            disabled={isLoading}
            rules={{
                required: t('eventNameRequired')
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('eventName')}
                        left={<TextInput.Icon icon='tag' focusable={false} disabled={true} />}
                        mode='outlined'
                        autoCapitalize='none'
                        autoComplete='off'
                        disabled={disabled}
                        error={!!error}
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoFocus
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

export default Name;
