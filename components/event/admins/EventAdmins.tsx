import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Chip, Icon, Text, useTheme } from 'react-native-paper';
import EventAdminJoin from './EventAdminJoin';
import EventAdminLeave from './EventAdminLeave';

type Props = {
    eventId: string;
    isAdmin: boolean;
    admins?: string[];
}

function EventAdmins({ eventId, isAdmin, admins }: Readonly<Props>) {
    const { t } = useTranslation();
    const theme = useTheme();
    // Leave
    const [adminName, setAdminName] = useState('');
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const hideLeaveModal = useCallback(() => setLeaveModalVisible(false), [setLeaveModalVisible]);
    const handleShowLeaveDialog = useCallback((admin: string) => () => {
        setAdminName(admin);
        isAdmin && setLeaveModalVisible(true);
    }, [isAdmin]);
    // Join
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const hideJoinModal = useCallback(() => setJoinModalVisible(false), [setJoinModalVisible]);
    const handleShowJoinDialog = useCallback(() => isAdmin && setJoinModalVisible(true), [isAdmin]);
    // RENDER
    return (
        <View style={styles.wrapper}>
            <View>
                <Text variant='titleMedium' style={styles.title}>
                    {t('eventAdmins')}
                </Text>
            </View>
            <View style={styles.chipWrapper}>
                {admins?.map(admin =>
                    <Chip key={admin} mode='outlined'
                        onClose={(isAdmin && admins.length > 1) ? handleShowLeaveDialog(admin) : undefined}
                    >
                        {admin}
                    </Chip>
                )}
                {isAdmin &&
                    <Chip key='add' mode='outlined'
                        onPress={handleShowJoinDialog}
                    >
                        <Icon source='plus' size={18} color={theme.colors.primary} />
                    </Chip>
                }
            </View>
            <EventAdminLeave
                eventId={eventId}
                adminName={adminName}
                modalVisible={leaveModalVisible}
                hideModal={hideLeaveModal}
                isAdmin={isAdmin}
            />
            <EventAdminJoin
                eventId={eventId}
                modalVisible={joinModalVisible}
                hideModal={hideJoinModal}
                isAdmin={isAdmin}
            />
        </View >
    );
}

export default memo(EventAdmins);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center'
    },
    chipWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 8
    },
    title: {
        fontWeight: 'bold'
    }
});
