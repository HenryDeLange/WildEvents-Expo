import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { User, UserLogin } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<User, any> | Control<UserLogin, any>;
    isLoading?: boolean;
}

function Username({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
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
