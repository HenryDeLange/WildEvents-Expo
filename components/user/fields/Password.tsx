import { useCallback, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, TextInputKeyPressEventData, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { User, UserLogin } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<User, any> | Control<UserLogin, any>;
    isLoading?: boolean;
    onEnterKeyPress?: () => void;
}

function Password({ control, isLoading, onEnterKeyPress }: Readonly<Props>) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = useCallback(() => setShowPassword(!showPassword), [showPassword]);
    const handleEnterKey = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (onEnterKeyPress && event.nativeEvent.key === 'Enter')
            onEnterKeyPress();
    }, [onEnterKeyPress]);
    return (
        <Controller control={control as Control<any, any>}
            name='password'
            disabled={isLoading}
            rules={{
                required: t('passwordRequired'),
                minLength: {
                    value: 8,
                    message: t('passwordError')
                }
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('password')}
                        placeholder={t('passwordHelp')}
                        left={<TextInput.Icon icon='key' focusable={false} disabled={true} />}
                        right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={toggleShowPassword} />}
                        mode='outlined'
                        autoCapitalize='none'
                        autoComplete='new-password'
                        disabled={disabled}
                        error={!!error}
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        onKeyPress={handleEnterKey}
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
