import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, View } from 'react-native';
import { Avatar, Menu, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDebounce } from 'use-debounce';
import { useUsersAutocompleteQuery } from '../../state/redux/api/iNaturalistApi';

type Props = {
    value: string;
    onChange: (text: string) => void;
    autoFocus?: boolean;
    disabled?: boolean;
    onEnterKeyPress?: () => void;
}

function AutocompleteINatUser({ value, onChange, autoFocus, disabled, onEnterKeyPress }: Props) {
    // Translation
    const { t } = useTranslation();
    // State
    const [selectedValue, setSelectedValue] = useState('');
    const [menuVisibility, setMenuVisibility] = useState(false);
    const showMenu = useCallback(() => setMenuVisibility(true), []);
    const hideMenu = useCallback(() => setMenuVisibility(false), []);
    // Debounce
    const [debouncedInaturalist] = useDebounce(value, 500);
    // Redux
    const { data: inaturalistUsers, isFetching, isSuccess } = useUsersAutocompleteQuery(
        { q: debouncedInaturalist, per_page: 4 },
        { skip: disabled || debouncedInaturalist.length <= 3 || value === selectedValue }
    );
    // Effects
    useEffect(() => {
        if (!isFetching && isSuccess)
            showMenu();
    }, [isFetching, isSuccess]);
    // Callbacks
    const handleMenuSelection = useCallback((text: string) => () => {
        onChange(text);
        setSelectedValue(text);
        hideMenu();
    }, [onChange]);
    const handleJoinEnterKey = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
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
        <>
            <View ref={inatRef as any}>
                <TextInput
                    mode='outlined'
                    label={t('registerCardINatName')}
                    placeholder={t('registerCardINatNameHelp')}
                    value={value}
                    onChangeText={onChange}
                    left={<TextInput.Icon focusable={false} disabled icon={({ size, color }) => (
                        <Image
                            source={require('../../assets/images/inaturalist/logo.png')}
                            style={{ width: size, height: size }}
                        />
                    )} />}
                    right={<TextInput.Icon icon={isFetching ? 'progress-clock' : 'menu-down'} onPress={showMenu} />}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    onKeyPress={handleJoinEnterKey}
                />
            </View>
            <Menu
                visible={menuVisibility}
                onDismiss={hideMenu}
                anchorPosition='bottom'
                anchor={menuPosition}
            >
                {!disabled && inaturalistUsers?.results.map((user) => (
                    <TouchableRipple key={user.login} style={styles.menuItemWrapper}
                        onPress={handleMenuSelection(user.login)}
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
                ))}
            </Menu>
        </>
    );
}

export default memo(AutocompleteINatUser);

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
