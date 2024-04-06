import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Avatar, Menu, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper';
import { useDebounce } from 'use-debounce';
import { Taxon, useTaxaAutocompleteQuery } from '../../../../state/redux/api/inatApi';

// TODO: Make this multi-selectable (using chips, similar to participants)

// TODO: Left icon click should open the iNat page for the taxon

// TODO: Add the locale for the common names in the useTaxaAutocompleteQuery

type Props = {
    value: string;
    onChange: (text: string) => void;
    disabled?: boolean;
}

function InaturalistTaxa({ value, onChange, disabled }: Readonly<Props>) {
    const theme = useTheme();
    // Translation
    const { t } = useTranslation();
    // State
    const [touched, setTouched] = useState(false);
    const [textValue, setTextValue] = useState(value);
    const [selectedTaxon, setSelectedTaxon] = useState<Taxon | null>(null);
    const [menuVisibility, setMenuVisibility] = useState(false);
    const showMenu = useCallback(() => {
        setMenuVisibility(true);
    }, []);
    const hideMenu = useCallback(() => {
        setMenuVisibility(false);
    }, []);
    // Debounce
    const [debouncedValue, debounce] = useDebounce(textValue, 500);
    const isPending = debounce.isPending();
    // Redux
    const { data: inaturalistTaxa, isFetching, isSuccess } = useTaxaAutocompleteQuery(
        { q: debouncedValue, per_page: 4 },
        { skip: (debouncedValue.length < 3 || textValue === selectedTaxon?.name || isPending) }
    );
    // Effects
    useEffect(() => {
        if (touched && !isFetching && isSuccess && !isPending)
            showMenu();
    }, [isFetching, isSuccess, isPending, showMenu, touched]);
    useEffect(() => {
        if (inaturalistTaxa?.total_results === 1) {
            setSelectedTaxon(inaturalistTaxa.results[0]);
            hideMenu();
        }
    }, [inaturalistTaxa, setSelectedTaxon, hideMenu]);
    useEffect(() => {
        setTouched(false);
    }, [setTouched]);
    // Callbacks
    const handleTextChange = useCallback((onChange: (text: string) => void) => (text: string) => {
        onChange(text);
        setTextValue(text);
        setSelectedTaxon(null);
    }, [onChange, setTextValue, setSelectedTaxon]);
    const handleMenuSelection = useCallback((onChange: (...event: any[]) => void, taxon: Taxon) => () => {
        onChange(taxon.name);
        setTextValue(taxon.name);
        setSelectedTaxon(taxon);
        hideMenu();
    }, [onChange, setTextValue, setSelectedTaxon, hideMenu]);
    const handleTouched = useCallback(() => {
        setTouched(true)
    }, [setTouched]);
    // Position Ref
    const inatRef = useRef<any>();
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; width: number; }>({ x: 0, y: 0, width: 0 });
    useEffect(() =>
        inatRef.current?.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
            setMenuPosition({ x: pageX, y: pageY + height, width: width / 2 });
        }), [inatRef.current]);
    useEffect(() => {
        if (!(menuPosition.x > 0 && menuPosition.y > 0))
            hideMenu();
    }, [menuPosition, hideMenu]);
    // RENDER
    return (
        <>
            <View ref={inatRef as any}>
                <TextInput
                    label={t('activityCriteria_taxon_name')}
                    placeholder={t('activityCriteriaHelp_taxon_name')}
                    left={
                        <TextInput.Icon focusable={false} disabled={true}
                            icon={({ size, color }) => (
                                <Image
                                    source={selectedTaxon?.default_photo?.url
                                        ? { uri: selectedTaxon?.default_photo?.url }
                                        : require('../../../../assets/images/inaturalist/logo.png')}
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
                    value={value ?? ''}
                    onChangeText={handleTextChange(onChange)}
                    onFocus={handleTouched}
                />
            </View>
            {(menuPosition.x > 0 && menuPosition.y > 0) &&
                <Menu
                    visible={menuVisibility}
                    onDismiss={hideMenu}
                    anchorPosition='bottom'
                    anchor={menuPosition}
                    contentStyle={{ backgroundColor: theme.colors.background }}
                    elevation={1}
                >
                    {!disabled &&
                        inaturalistTaxa?.results.map((taxon) => (
                            <TouchableRipple key={taxon.id} style={styles.menuItemWrapper}
                                onPress={handleMenuSelection(onChange, taxon)}
                            >
                                <>
                                    <Avatar.Image
                                        style={styles.menuItemAvatar}
                                        source={taxon?.default_photo?.url
                                            ? { uri: taxon?.default_photo?.url }
                                            : require('../../../../assets/images/inaturalist/logo.png')}
                                        size={32}
                                    />
                                    <View style={{ width: menuPosition.width }}>
                                        <Text variant='labelLarge'>
                                            {`${taxon.name} (${taxon.rank})`}
                                        </Text>
                                        <Text variant='labelSmall'>
                                            {taxon.preferred_common_name}
                                        </Text>
                                    </View>
                                </>
                            </TouchableRipple>
                        ))
                    }
                </Menu>
            }
        </>
    );
}

export default memo(InaturalistTaxa);

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
