import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, HelperText, IconButton, Menu, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDebounce } from 'use-debounce';
import { useUsersAutocompleteQuery } from '../../state/redux/api/iNaturalistApi';
import { useRegisterMutation } from '../../state/redux/api/wildEventsApi';
import { doLogin } from '../../state/redux/auth/authSlice';
import { REFRESH_TOKEN, saveData } from '../../state/redux/auth/authStorage';
import { useAppDispatch } from '../../state/redux/hooks';
import { useIsMobile } from '../ui/utils';
import AutocompleteINatUser from '../ui/AutocompleteINatUser';

export default memo(function () {
    // UI
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 650
    }), [isMobile]);
    // Translation
    const { t } = useTranslation();
    // State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = useCallback(() => setShowPassword(!showPassword), [showPassword]);
    const [inaturalist, setInaturalist] = useState('');
    // Redux
    const dispatch = useAppDispatch();
    const [register, { isLoading, isError }] = useRegisterMutation();
    // Actions
    const router = useRouter();
    const handleRegister = useCallback(async () => {
        try {
            const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, password);
            await register({ user: { inaturalist, username, password: digest } })
                .unwrap()
                .then((login) => {
                    dispatch(doLogin({
                        username: login.username,
                        inaturalist: login.inaturalist,
                        accessToken: login.accessToken,
                        refreshToken: login.refreshToken
                    }));
                    saveData(REFRESH_TOKEN, login.refreshToken);
                    router.replace('/(auth)/events');
                });
        }
        catch (err) {
            console.error('Register failed!', err);
        }
    }, [register, dispatch, router, inaturalist, username, password]);
    // Validation
    const inatNameError = inaturalist.length < 3;
    const usernameError = username.length < 3;
    const passwordError = password.length < 8;
    const confirmPasswordError = confirmPassword !== password;
    // RENDER
    return (
        <Card elevation={4} style={cardStyle}>
            <Card.Title title={t('registerCardTitle')} titleVariant='titleLarge' />
            <Card.Content style={styles.content}>
                <TextInput
                    mode='outlined'
                    label={t('registerCardUsername')}
                    placeholder={t('registerCardUsernameHelp')}
                    value={username}
                    onChangeText={setUsername}
                    left={<TextInput.Icon icon='account-circle' focusable={false} disabled />}
                    autoFocus
                />
                {(username.length > 0 && usernameError) &&
                    <HelperText type='error' >
                        {t('registerCardUsernameError')}
                    </HelperText>
                }
                <TextInput
                    mode='outlined'
                    label={t('registerCardPassword')}
                    placeholder={t('registerCardPasswordHelp')}
                    value={password}
                    onChangeText={setPassword}
                    left={<TextInput.Icon icon='key' focusable={false} disabled />}
                    right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={toggleShowPassword} />}
                    secureTextEntry={!showPassword}
                />
                {(password.length > 0 && passwordError) &&
                    <HelperText type='error'>
                        {t('registerCardPasswordError')}
                    </HelperText>
                }
                <TextInput
                    mode='outlined'
                    label={t('registerCardConfirmPassword')}
                    placeholder={t('registerCardConfirmPasswordHelp')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    left={<TextInput.Icon icon='key' focusable={false} disabled />}
                    right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={toggleShowPassword} />}
                    secureTextEntry={!showPassword}
                />
                {(confirmPassword.length > 0 && confirmPasswordError) &&
                    <HelperText type='error' >
                        {t('registerCardConfirmPasswordError')}
                    </HelperText>
                }
                <AutocompleteINatUser
                    value={inaturalist}
                    onChange={setInaturalist}
                />
                {(inaturalist.length > 0 && inatNameError) &&
                    <HelperText type='error'>
                        {t('registerCardINatNameError')}
                    </HelperText>
                }
                <View style={styles.buttonWrapper}>
                    <Button mode='contained' style={styles.button} uppercase
                        icon={isLoading ? undefined : 'account-plus'}
                        disabled={isLoading || inatNameError || usernameError || passwordError || confirmPasswordError}
                        onPress={handleRegister}
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
});

const styles = StyleSheet.create({
    content: {
        gap: 15
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    button: {
        marginBottom: 8,
        width: '80%'
    }
});
