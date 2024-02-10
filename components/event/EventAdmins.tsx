import { useAdminJoinEventMutation, useAdminLeaveEventMutation } from '@/state/redux/api/wildEventsApi';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Dialog, HelperText, Icon, Text, TextInput, useTheme } from 'react-native-paper';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

type Props = {
    eventId: string;
    isAdmin: boolean;
    admins: string[];
}

function EventAdmins({ eventId, isAdmin, admins }: Readonly<Props>) {
    const { t } = useTranslation();
    const theme = useTheme();

    // Current admin username
    const [adminName, setAdminName] = useState('');

    // Leave
    const [doLeave, { isLoading: isLeaving, isError: isLeaveError, isSuccess: isLeft }] = useAdminLeaveEventMutation();
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const handleHideLeaveDialog = useCallback(() => {
        if (!isLeaving)
            setShowLeaveDialog(false);
    }, [isLeaving]);
    const handleShowLeaveDialog = useCallback((admin: string) => () => {
        setAdminName(admin);
        setShowLeaveDialog(true);
    }, []);
    const handleLeave = useCallback(() => {
        doLeave({
            id: eventId,
            adminId: adminName
        });
    }, [adminName]);
    useEffect(() => {
        if (isLeft && !isLeaveError)
            setShowLeaveDialog(false);
    }, [isLeft, isLeaveError]);

    // Join
    const [doJoin, { isLoading: isJoining, isError: isJoinError, isSuccess: isJoined }] = useAdminJoinEventMutation();
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const handleHideJoinDialog = useCallback(() => {
        if (!isJoining)
            setShowJoinDialog(false);
    }, [isJoining]);
    const handleJoinButton = useCallback(() => setShowJoinDialog(true), []);
    const handleJoin = useCallback(() => {
        doJoin({
            id: eventId,
            adminId: adminName
        });
    }, [adminName]);
    const handleJoinEnterKey = useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (event.nativeEvent.key === 'Enter')
            handleJoin();
    }, [handleJoin]);
    useEffect(() => {
        if (isJoined && !isJoinError)
            setShowJoinDialog(false);
    }, [isJoined, isJoinError]);

    // RENDER
    return (
        <View style={styles.wrapper}>
            {/* Admin Chips */}
            <Text variant='headlineSmall'>
                {t('eventAdmins')}
            </Text>
            <View style={styles.chipWrapper}>
                {admins.map(admin =>
                    <Chip key={admin} mode='outlined'
                        onClose={(isAdmin && admins.length > 1) ? handleShowLeaveDialog(admin) : undefined}
                    >
                        {admin}
                    </Chip>
                )}
                {isAdmin &&
                    <Chip key='add' mode='outlined'
                        onPress={handleJoinButton}
                    >
                        <Icon source='plus' size={18} color={theme.colors.primary} />
                    </Chip>
                }
            </View>
            {/* Leave Dialog */}
            <ResponsiveCardWrapper modalVisible={showLeaveDialog} hideModal={handleHideLeaveDialog}>
                <Dialog.Title>{t('eventAdminLeaveTitle')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant='bodyMedium'>
                        {t('eventAdminLeaveMessage', { admin: adminName })}
                    </Text>
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isLeaving ? undefined : 'check'}
                            disabled={isLeaving}
                            onPress={handleLeave}
                        >
                            {isLeaving ? <ActivityIndicator animating={true} /> : t('confirm')}
                        </Button>
                        {isLeaveError &&
                            <HelperText type='error' visible={isLeaveError} >
                                {t('eventAdminLeaveError')}
                            </HelperText>
                        }
                    </View>
                </Dialog.Content>
            </ResponsiveCardWrapper>
            {/* Join Dialog */}
            <ResponsiveCardWrapper modalVisible={showJoinDialog} hideModal={handleHideJoinDialog}>
                <Dialog.Title>{t('eventAdminJoinTitle')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant='bodyMedium'>
                        {t('eventAdminJoinMessage')}
                    </Text>
                    <TextInput
                        style={styles.adminName}
                        mode='outlined'
                        label={t('eventAdminJoinInput')}
                        value={adminName}
                        onChangeText={setAdminName}
                        autoFocus
                        onKeyPress={handleJoinEnterKey}
                    />
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isJoining ? undefined : 'check'}
                            disabled={isJoining || !adminName || adminName.trim().length === 0}
                            onPress={handleJoin}
                        >
                            {isJoining ? <ActivityIndicator animating={true} /> : t('confirm')}
                        </Button>
                        {isJoinError &&
                            <HelperText type='error' visible={isJoinError} >
                                {t('eventAdminJoinError')}
                            </HelperText>
                        }
                    </View>
                </Dialog.Content>
            </ResponsiveCardWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center'
    },
    chipWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 8
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    },
    adminName: {
        marginTop: 15
    }
});

export default memo(EventAdmins);
