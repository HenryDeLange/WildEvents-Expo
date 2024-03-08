import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText } from 'react-native-paper';
import { useRegisterMutation } from '../../state/redux/api/wildEventsApi';
import { doLogin } from '../../state/redux/auth/authSlice';
import { REFRESH_TOKEN, saveData } from '../../state/redux/auth/authStorage';
import { useAppDispatch } from '../../state/redux/hooks';
import { useIsMobile } from '../ui/utils';
import Inaturalist from './fields/Inaturalist';
import Password from './fields/Password';
import PasswordConfirm from './fields/PasswordConfirm';
import Username from './fields/Username';
import { RegisterUser } from './fields/userTypes';

function RegisterCard() {
    // UI
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 650
    }), [isMobile]);
    // Translation
    const { t } = useTranslation();
    // Router
    const router = useRouter();
    // Form
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterUser>();
    // Redux
    const dispatch = useAppDispatch();
    const [doRegister, { data: registerResponse, isLoading, isSuccess, isError }] = useRegisterMutation();
    // Actions
    const handleRegister = useCallback<SubmitHandler<RegisterUser>>(async (data) => {
        const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, data.password);
        doRegister({
            user: {
                ...data,
                password: digest
            }
        });
    }, [doRegister, dispatch, router]);
    useEffect(() => {
        if (isSuccess && registerResponse) {
            dispatch(doLogin({
                username: registerResponse.username,
                inaturalist: registerResponse.inaturalist,
                accessToken: registerResponse.accessToken,
                refreshToken: registerResponse.refreshToken
            }));
            saveData(REFRESH_TOKEN, registerResponse.refreshToken);
            router.replace('/(auth)/events');
        }
    }, [dispatch, doLogin, saveData, router, registerResponse, isSuccess]);
    // RENDER
    return (
        <Card elevation={4} style={cardStyle}>
            <Card.Title title={t('registerCardTitle')} titleVariant='titleLarge' />
            <Card.Content style={styles.content}>
                <Username control={control} isLoading={isLoading} />
                <Password control={control} isLoading={isLoading} />
                <PasswordConfirm control={control} isLoading={isLoading} />
                <Inaturalist control={control} isLoading={isLoading} />
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon={isLoading ? undefined : 'account-plus'}
                        disabled={isLoading || Object.keys(errors).length > 0}
                        onPress={handleSubmit(handleRegister)}
                    >
                        {isLoading ? <ActivityIndicator animating={true} /> : t('registerButton')}
                    </Button>
                    {isError &&
                        <HelperText type='error' visible={isError} >
                            {t('registerCardFailed')}
                        </HelperText>
                    }
                </View>
            </Card.Content>
        </Card>
    );
}

export default RegisterCard;

const styles = StyleSheet.create({
    content: {
        gap: 12
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    button: {
        marginBottom: 8,
        width: '80%'
    }
});
