import { useCallback, useEffect, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Image, NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, View } from 'react-native';
import { Avatar, HelperText, Menu, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDebounce } from 'use-debounce';
import { User as inatUser, useUsersAutocompleteQuery } from '../../../state/redux/api/inatApi';
import { User } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<User, any> | Control<any, any>;
    isLoading?: boolean;
    autoFocus?: boolean;
    onEnterKeyPress?: () => void;
}

function Inaturalist({ control, isLoading, autoFocus, onEnterKeyPress }: Readonly<Props>) {
    // Translation
    const { t } = useTranslation();
    // State
    const [textValue, setTextValue] = useState('');
    const [selectedUser, setSelectedUser] = useState<inatUser | null>(null);
    const [menuVisibility, setMenuVisibility] = useState(false);
    const showMenu = useCallback(() => setMenuVisibility(true), []);
    const hideMenu = useCallback(() => setMenuVisibility(false), []);
    // Debounce
    const [debouncedValue, debounce] = useDebounce(textValue, 500);
    // Redux
    const { data: inaturalistUsers, isFetching, isSuccess } = useUsersAutocompleteQuery(
        { q: debouncedValue, per_page: 4 },
        { skip: debouncedValue.length < 3 || textValue === selectedUser?.login || debounce.isPending() }
    );
    // Effects
    useEffect(() => {
        if (!isFetching && isSuccess && !debounce.isPending())
            showMenu();
    }, [isFetching, isSuccess]);
    // Callbacks
    const handleTextChange = useCallback((onChange: (text: string) => void) => (text: string) => {
        onChange(text);
        setTextValue(text);
        setSelectedUser(null);
    }, [setTextValue, setSelectedUser]);
    const handleMenuSelection = useCallback((onChange: (...event: any[]) => void, user: inatUser) => () => {
        onChange(user.login);
        setTextValue(user.login);
        setSelectedUser(user);
        hideMenu();
    }, [setTextValue, setSelectedUser]);
    const handleEnterKey = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (onEnterKeyPress && event.nativeEvent.key === 'Enter')
            onEnterKeyPress();
    }, [onEnterKeyPress]);
    // Position Ref
    const inatRef = useRef<any>();
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; width: number; }>({ x: 0, y: 0, width: 0 });
    useEffect(() =>
        inatRef.current?.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
            setMenuPosition({ x: pageX, y: pageY + height, width: width / 2 });
        }), [inatRef.current]);
    // RENDER
    return (
        <Controller control={control}
            name='inaturalist'
            disabled={isLoading}
            rules={{
                required: t('inatNameError'),
                onChange: (event) => setTextValue(event.target.value)
            }}
            render={({ field: { onBlur, onChange, value, disabled }, fieldState: { error } }) => (
                <View>
                    <View ref={inatRef as any}>
                        <TextInput
                            label={t('inatName')}
                            placeholder={t('inatNameHelp')}
                            left={
                                <TextInput.Icon focusable={false} disabled={true}
                                    icon={({ size, color }) => (
                                        <Image
                                            source={selectedUser?.icon
                                                ? { uri: selectedUser.icon }
                                                : require('../../../assets/images/inaturalist/logo.png')}
                                            style={{ width: size, height: size }}
                                        />
                                    )}
                                />
                            }
                            right={<TextInput.Icon icon={isFetching ? 'progress-clock' : 'menu-down'} onPress={showMenu} />}
                            mode='outlined'
                            autoCapitalize='none'
                            autoComplete='off'
                            spellCheck={false}
                            disabled={disabled}
                            error={!!error}
                            value={value ?? ''}
                            onChangeText={handleTextChange(onChange)}
                            onBlur={onBlur}
                            autoFocus={autoFocus}
                            onKeyPress={handleEnterKey}
                        />
                    </View>
                    <Menu
                        visible={menuVisibility}
                        onDismiss={hideMenu}
                        anchorPosition='bottom'
                        anchor={menuPosition}
                    >
                        {!disabled && inaturalistUsers?.results.map((user) => (
                            <TouchableRipple key={user.id} style={styles.menuItemWrapper}
                                onPress={handleMenuSelection(onChange, user)}
                            >
                                <>
                                    <Avatar.Image source={{ uri: user.icon }} size={32} style={styles.menuItemAvatar} />
                                    <View style={{ width: menuPosition.width }}>
                                        <Text variant='labelLarge'>
                                            {(user.name && user.name.trim().length > 0) ? user.name : user.login}
                                        </Text>
                                        <Text variant='labelSmall'>
                                            {user.login}
                                        </Text>
                                    </View>
                                </>
                            </TouchableRipple>
                        ))
                        }
                    </Menu>
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

export default Inaturalist;

const styles = StyleSheet.create({
    menuItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 8
    },
    menuItemAvatar: {
        marginHorizontal: 12
    }
});
