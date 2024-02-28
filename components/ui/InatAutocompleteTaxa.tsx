import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, View } from 'react-native';
import { Avatar, Menu, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { useDebounce } from 'use-debounce';
import { Taxon, useTaxaAutocompleteQuery } from '../../state/redux/api/inatApi';

type Props = {
    value: string;
    onChange: (text: string) => void;
    autoFocus?: boolean;
    disabled?: boolean;
    onEnterKeyPress?: () => void;
}

// TODO: Make this multi-selectable (using chips, similar to participants)

function InatAutocompleteTaxa({ value, onChange, autoFocus, disabled, onEnterKeyPress }: Readonly<Props>) {
    // Translation
    const { t } = useTranslation();
    // State
    const [selectedValue, setSelectedValue] = useState(value);
    const [menuVisibility, setMenuVisibility] = useState(false);
    const showMenu = useCallback(() => setMenuVisibility(true), []);
    const hideMenu = useCallback(() => setMenuVisibility(false), []);
    // Debounce
    const [debouncedValue] = useDebounce(value, 500);
    // Redux
    const { data: inaturalistTaxa, isFetching, isSuccess } = useTaxaAutocompleteQuery(
        // TODO: add locale
        { q: debouncedValue, per_page: 4 },
        { skip: disabled || debouncedValue.length <= 3 || value === selectedValue }
    );
    // Effects
    useEffect(() => {
        if (!isFetching && isSuccess && value !== selectedValue) {
            showMenu();
        }
    }, [isFetching, isSuccess, selectedValue]);
    // Callbacks
    const handleMenuSelection = useCallback((text: Taxon) => () => {
        onChange(text.name);
        setSelectedValue(text.name);
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
                    label={t('activityCriteria_taxon_name')}
                    placeholder={t('activityCriteriaHelp_taxon_name')}
                    value={value}
                    onChangeText={onChange}
                    left={
                        <TextInput.Icon
                            focusable={false}
                            disabled
                            icon={({ size, color }) => (
                                <Image
                                    source={require('../../assets/images/inaturalist/logo.png')}
                                    style={{ width: size, height: size }}
                                />
                            )}
                        />
                    }
                    right={
                        <TextInput.Icon
                            icon={isFetching ? 'progress-clock' : 'menu-down'}
                            onPress={showMenu}
                            disabled={isFetching || !isSuccess || (inaturalistTaxa.results.length <= 0)}
                        />
                    }
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
                {!disabled && inaturalistTaxa?.results.map((taxon) => (
                    <TouchableRipple key={taxon.id} style={styles.menuItemWrapper}
                        onPress={handleMenuSelection(taxon)}
                    >
                        <>
                            <Avatar.Image
                                source={(taxon.default_photo && taxon.default_photo.square_url)
                                    ? { uri: taxon.default_photo.square_url }
                                    : require('../../assets/images/inaturalist/logo.png')}
                                size={32}
                                style={styles.menuItemAvatar}
                            />
                            <View style={{ width: menuPosition.width }}>
                                <Text variant='labelLarge'>
                                    {taxon.preferred_common_name}
                                </Text>
                                <Text variant='labelSmall'>
                                    {taxon.name}
                                </Text>
                            </View>
                        </>
                    </TouchableRipple>
                ))}
            </Menu>
        </>
    );
}

export default memo(InatAutocompleteTaxa);

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
