import { ReactNode, memo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Modal, Portal } from 'react-native-paper';

type Props = {
    modalVisible: boolean;
    hideModal: () => void;
    children: ReactNode;
}

export default memo(function ({ modalVisible, hideModal, children }: Props) {
    const { width } = useWindowDimensions();
    return (
        <Portal>
            <Modal
                visible={modalVisible}
                onDismiss={hideModal}
                contentContainerStyle={[
                    styles.modal,
                    {
                        width: width < 500 ? '90%' : '80%',
                        maxWidth: width > 700 ? 650 : undefined
                    }
                ]}
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
