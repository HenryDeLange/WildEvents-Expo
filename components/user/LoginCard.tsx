import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Card, HelperText } from 'react-native-paper';
import { UserLogin, addTagTypes, useLoginMutation, wildEventsApi } from '../../state/redux/api/wildEventsApi';
import { authLogin } from '../../state/redux/auth/authSlice';
import { REFRESH_TOKEN, saveData } from '../../state/redux/auth/authStorage';
import { useAppDispatch } from '../../state/redux/hooks';
import { useIsMobile } from '../ui/utils';
import Password from './fields/Password';
import Username from './fields/Username';

export default memo(function () {
    const { t } = useTranslation();
    const router = useRouter();
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 650
    }), [isMobile]);
    // Form
    const { control, handleSubmit, formState: { isValid } } = useForm<UserLogin>();
    // Redux
    const dispatch = useAppDispatch();
    const [doLogin, { data: loginResponse, isLoading, isSuccess, isError }] = useLoginMutation();
    // Actions
    const handleLogin = useCallback<SubmitHandler<UserLogin>>(async (data) => {
        const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, data.password);
        doLogin({ userLogin: { ...data, password: digest } });
    }, [doLogin]);
    useEffect(() => {
        if (isSuccess && loginResponse) {
            dispatch(authLogin({
                username: loginResponse.username,
                inaturalist: loginResponse.inaturalist,
                accessToken: loginResponse.accessToken,
                refreshToken: loginResponse.refreshToken
            }));
            saveData(REFRESH_TOKEN, loginResponse.refreshToken);
            for (let tag of addTagTypes) {
                dispatch(wildEventsApi.util.invalidateTags([tag]));
            }
            // TODO: Only navigate to events if not already on the All Events / Single Event pages
            router.replace('/(auth)/events');
        }
    }, [dispatch, saveData, router, loginResponse, isSuccess]);
    // RENDER
    const submit = handleSubmit(handleLogin);
    return (
        <Card elevation={4} style={cardStyle}>
            <Card.Title title={t('loginCardTitle')} titleVariant='titleLarge' />
            <Card.Content style={styles.content}>
                <Username control={control} isLoading={isLoading} />
                <Password control={control} isLoading={isLoading}
                    onEnterKeyPress={useCallback(() =>
                        isValid && submit(), [handleSubmit, handleLogin, isValid])}
                />
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon={'login-variant'}
                        disabled={isLoading || !isValid}
                        loading={isLoading}
                        onPress={submit}
                    >
                        {t('loginButton')}
                    </Button>
                    {isError &&
                        <HelperText type='error' visible={isError} >
                            {t('loginCardFailed')}
                        </HelperText>
                    }
                </View>
            </Card.Content>
        </Card>
    );
});

const styles = StyleSheet.create({
    content: {
        gap: 12
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginBottom: 10,
        width: '80%'
    }
});
