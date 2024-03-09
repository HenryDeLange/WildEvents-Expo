import { useCallback } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { EventBase } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<EventBase, any>;
    isLoading?: boolean;
}

function Visibility({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    const handleVisibilityChange = useCallback((onChange: (value: EventBase['visibility']) => void, visibility: EventBase['visibility']) => () => {
        onChange(visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE');
    }, []);
    return (
        <Controller control={control}
            name='visibility'
            disabled={isLoading}
            // rules={{}}
            defaultValue='PUBLIC'
            render={({ field: { onBlur, onChange, value, disabled } }) => (
                <View style={styles.visibility}>
                    <Text
                        disabled={disabled}
                        onPress={disabled ? undefined : handleVisibilityChange(onChange, value)}
                    >
                        {t(`eventVisibility${value}`)}
                    </Text>
                    <IconButton
                        icon={value === 'PRIVATE' ? 'lock' : 'lock-open-outline'}
                        disabled={disabled}
                        selected={value === 'PRIVATE'}
                        onPress={handleVisibilityChange(onChange, value)}
                        onBlur={onBlur}
                        animated
                    />
                </View >
            )}
        />
    );
}

export default Visibility;

const styles = StyleSheet.create({
    visibility: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
