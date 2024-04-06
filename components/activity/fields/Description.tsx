import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { HelperText, Icon, TextInput } from 'react-native-paper';
import { ActivityCreate } from '../../../state/redux/api/wildEventsApi';
import { memo } from 'react';

type Props = {
    control: Control<ActivityCreate, any>;
    loading?: boolean;
}

function Description({ control, loading }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Controller control={control}
            name='description'
            disabled={loading}
            rules={{
                required: false
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('activityCardDescription')}
                        left={<TextInput.Icon icon={({ size, color }) => <Icon source='information' size={size} />} focusable={false} disabled={true} />}
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

export default memo(Description);
