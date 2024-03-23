import { useCallback } from 'react';
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

function Username({ control, isLoading, onEnterKeyPress }: Readonly<Props>) {
    const { t } = useTranslation();
    const handleEnterKey = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (onEnterKeyPress && event.nativeEvent.key === 'Enter')
            onEnterKeyPress();
    }, [onEnterKeyPress]);
    return (
        <Controller control={control as Control<any, any>}
            name='username'
            disabled={isLoading}
            rules={{
                required: t('usernameRequired'),
                minLength: {
                    value: 4,
                    message: t('usernameError')
                }
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('username')}
                        placeholder={t('usernameHelp')}
                        left={<TextInput.Icon icon='account-circle' focusable={false} disabled={true} />}
                        mode='outlined'
                        autoCapitalize='none'
                        autoComplete='username'
                        disabled={disabled}
                        error={!!error}
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoFocus
                        onKeyPress={handleEnterKey}
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

export default Username;
