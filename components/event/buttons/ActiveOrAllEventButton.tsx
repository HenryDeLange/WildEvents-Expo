import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, useTheme } from 'react-native-paper';
import { useIsMobile } from '../../ui/utils';

type Props = {
    onlyActive: boolean;
    setOnlyActive: Dispatch<SetStateAction<boolean>>;
}

function ActiveOrAllEventButton({ onlyActive, setOnlyActive }: Readonly<Props>) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useIsMobile();
    const handleToggle = useCallback(() => {
        setOnlyActive(!onlyActive)
    }, [onlyActive, setOnlyActive]);
    return (
        <View style={{ flexDirection: 'row', gap: 8 }}>
            <Switch value={onlyActive} onValueChange={handleToggle} />
            <Text style={[styles.label, { color: onlyActive ? theme.colors.primary : theme.colors.onSurfaceDisabled }]} onPress={handleToggle}>
                {t(`${onlyActive ? 'eventsOnlyActive' : 'eventsAll'}${isMobile ? 'Mobile' : ''}`).toUpperCase()}
            </Text>
        </View>
    );
}

export default memo(ActiveOrAllEventButton);

const styles = StyleSheet.create({
    label: {
        fontWeight: 'bold',
        fontSize: 16
    }
});
