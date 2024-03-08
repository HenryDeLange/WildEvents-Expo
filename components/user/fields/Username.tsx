import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HelperText, TextInput } from 'react-native-paper';
import { RegisterUser } from './userTypes';
import { View } from 'react-native';

type Props = {
    control: Control<RegisterUser, any>;
    isLoading?: boolean;
}

function Username({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <Controller control={control}
            name='username'
            disabled={isLoading}
            rules={{
                required: t('registerCardUsernameRequired'),
                minLength: {
                    value: 4,
                    message: t('registerCardUsernameError')
                }
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <TextInput
                        label={t('registerCardUsername')}
                        placeholder={t('registerCardUsernameHelp')}
                        left={<TextInput.Icon icon='account-circle' focusable={false} disabled={true} />}
                        mode='outlined'
                        autoCapitalize='none'
                        autoComplete='username'
                        disabled={disabled}
                        error={!!error}
                        value={value}
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
