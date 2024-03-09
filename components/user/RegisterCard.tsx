import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Card, HelperText } from 'react-native-paper';
import { User, useRegisterMutation } from '../../state/redux/api/wildEventsApi';
import { authLogin } from '../../state/redux/auth/authSlice';
import { REFRESH_TOKEN, saveData } from '../../state/redux/auth/authStorage';
import { useAppDispatch } from '../../state/redux/hooks';
import { useIsMobile } from '../ui/utils';
import Inaturalist from './fields/Inaturalist';
import Password from './fields/Password';
import Username from './fields/Username';

function RegisterCard() {
    const { t } = useTranslation();
    const router = useRouter();
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 650
    }), [isMobile]);
    // Form
    const { control, handleSubmit, formState: { isValid } } = useForm<User>();
    // Redux
    const dispatch = useAppDispatch();
    const [doRegister, { data: registerResponse, isLoading, isSuccess, isError }] = useRegisterMutation();
    // Actions
    const handleRegister = useCallback<SubmitHandler<User>>(async (data) => {
        const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, data.password);
        doRegister({ user: { ...data, password: digest } });
    }, [doRegister]);
    useEffect(() => {
        if (isSuccess && registerResponse) {
            dispatch(authLogin({
                username: registerResponse.username,
                inaturalist: registerResponse.inaturalist,
                accessToken: registerResponse.accessToken,
                refreshToken: registerResponse.refreshToken
            }));
            saveData(REFRESH_TOKEN, registerResponse.refreshToken);
            router.replace('/(auth)/events');
        }
    }, [dispatch, saveData, router, registerResponse, isSuccess]);
    // RENDER
    return (
        <Card elevation={4} style={cardStyle}>
            <Card.Title title={t('registerCardTitle')} titleVariant='titleLarge' />
            <Card.Content style={styles.content}>
                <Username control={control} isLoading={isLoading} />
                <Password control={control} isLoading={isLoading} />
                <Inaturalist control={control} isLoading={isLoading} />
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon='account-plus'
                        disabled={isLoading || !isValid}
                        loading={isLoading}
                        onPress={handleSubmit(handleRegister)}
                    >
                        {t('registerButton')}
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
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginBottom: 8,
        width: '80%'
    }
});
