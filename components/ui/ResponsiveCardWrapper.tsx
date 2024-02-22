import { ReactNode, memo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card, Modal, Portal } from 'react-native-paper';
import { useIsMobile } from './utils';

type Props = {
    modalVisible: boolean;
    hideModal: () => void;
    children: ReactNode;
}

export default memo(function ({ modalVisible, hideModal, children }: Props) {
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = {
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 650
    };
    return (
        <Portal>
            <Modal
                visible={modalVisible}
                onDismiss={hideModal}
                contentContainerStyle={[styles.modal, cardStyle]}
            >
                <Card elevation={5} style={styles.card}>
                    {children}
                </Card>
            </Modal>
        </Portal>
    );
});

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10
    },
    card: {
        width: '100%'
    }
});
