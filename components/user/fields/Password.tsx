import { useCallback, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HelperText, TextInput } from 'react-native-paper';
import { RegisterUser } from './userTypes';
import { View } from 'react-native';

type Props = {
    control: Control<RegisterUser, any>;
    isLoading?: boolean;
}

function Password({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = useCallback(() => setShowPassword(!showPassword), [showPassword]);
    return (
        <Controller control={control}
            name='password'
            disabled={isLoading}
            rules={{
                required: t('registerCardPasswordRequired'),
                minLength: {
                    value: 8,
                    message: t('registerCardPasswordError')
                }
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('registerCardPassword')}
                        placeholder={t('registerCardPasswordHelp')}
                        left={<TextInput.Icon icon='key' focusable={false} disabled={true} />}
                        right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={toggleShowPassword} />}
                        mode='outlined'
                        autoCapitalize='none'
                        autoComplete='new-password'
                        disabled={disabled}
                        error={!!error}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                    />
                    {!!error &&
                        <HelperText type='error' >
                            {error.message}
                        </HelperText>
                    }
                </View>
            )}
        />
    );
}

export default Password;
