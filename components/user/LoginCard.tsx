import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, View, ViewStyle, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText, TextInput } from 'react-native-paper';
import { useLoginMutation } from '../../state/redux/api/wildEventsApi';
import { doLogin } from '../../state/redux/auth/authSlice';
import { REFRESH_TOKEN, saveData } from '../../state/redux/auth/authStorage';
import { useAppDispatch } from '../../state/redux/hooks';

export default memo(function () {
    // UI
    const { width } = useWindowDimensions();
    const cardStyle: ViewStyle = {
        width: width < 500 ? '90%' : '80%',
        maxWidth: width > 700 ? 650 : undefined
    };
    // Translation
    const { t } = useTranslation();
    // State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = useCallback(() => setShowPassword(!showPassword), [showPassword]);
    // Redux
    const dispatch = useAppDispatch();
    const [login, { isLoading, isError }] = useLoginMutation();
    // Actions
    const router = useRouter();
    const handleLogin = useCallback(async () => {
        try {
            const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, password);
            await login({ userLogin: { username, password: digest } })
                .unwrap()
                .then((login) => {
                    dispatch(doLogin({
                        username: login.username,
                        inaturalist: login.inaturalist,
                        accessToken: login.accessToken,
                        refreshToken: login.refreshToken
                    }));
                    saveData(REFRESH_TOKEN, login.refreshToken);
                    // TODO: Only navigate to events if not already on the All Events / Single Event pages
                    router.replace('/(auth)/events');
                });
        }
        catch (err) {
            console.error('Login failed!', err);
        }
    }, [login, dispatch, router, username, password]);
    // Validation
    const usernameError = username.length < 3;
    const passwordError = password.length < 8;
    // RENDER
    return (
        <Card elevation={4} style={cardStyle}>
            <Card.Title title={t('loginCardTitle')} titleVariant='titleLarge' />
            <Card.Content style={styles.content}>
                <TextInput
                    mode='outlined'
                    label={t('loginCardUsername')}
                    placeholder={t('loginCardUsernameHelp')}
                    value={username}
                    onChangeText={setUsername}
                    left={<TextInput.Icon icon='account-circle' focusable={false} disabled />}
                    autoFocus
                />
                <TextInput
                    mode='outlined'
                    label={t('loginCardPassword')}
                    placeholder={t('loginCardPasswordHelp')}
                    value={password}
                    onChangeText={setPassword}
                    left={<TextInput.Icon icon='key' focusable={false} disabled />}
                    right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={toggleShowPassword} />}
                    secureTextEntry={!showPassword}
                    onKeyPress={useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
                        (event.nativeEvent.key === 'Enter') && handleLogin(), [handleLogin])}
                />
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon={isLoading ? undefined : 'login-variant'}
                        disabled={isLoading || usernameError || passwordError}
                        onPress={handleLogin}
                    >
                        {isLoading ? <ActivityIndicator animating={true} /> : t('loginButton')}
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
        gap: 15
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
