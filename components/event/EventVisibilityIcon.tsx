import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Icon, Tooltip } from 'react-native-paper';
import { EventBase } from '../../state/redux/api/wildEventsApi';

type Props = {
    visibility: EventBase['visibility'];
    size: number;
}

function EventVisibilityIcon({ visibility, size }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <View style={styles.wrapper}>
            <Tooltip title={t(`eventVisibility${visibility}`)}>
                <Icon
                    source={visibility === 'PRIVATE' ? 'lock' : 'lock-open-outline'}
                    size={size}
                />
            </Tooltip>
        </View>
    );
}

export default memo(EventVisibilityIcon);

const styles = StyleSheet.create({
    wrapper: {
        marginLeft: 8,
        justifyContent: 'center'
    }
});
