import { ReactNode, memo, useMemo } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Modal, Portal } from 'react-native-paper';
import { useIsMobile } from './utils';

type Props = {
    modalVisible: boolean;
    hideModal: () => void;
    children: ReactNode;
}

export default memo(function ({ modalVisible, hideModal, children }: Props) {
    const isMobile = useIsMobile();
    const cardStyle: ViewStyle = useMemo(() => ({
        width: isMobile ? '90%' : '80%',
        maxWidth: isMobile ? undefined : 650
    }), [isMobile]);
    return (

        <Portal>
            <Modal
                visible={modalVisible}
                onDismiss={hideModal}
                contentContainerStyle={[styles.modal, cardStyle]}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.container}
                >
                    <View style={styles.view}>
                        <Card elevation={5} style={styles.card}>
                            {children}
                        </Card>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
});

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 20,
        flexShrink: 1
    },
    scrollView: {
        width: '100%',
        flexGrow: 1
    },
    view: {
        flexGrow: 1
    },
    container: {
        flexGrow: 1
    },
    card: {
        flexGrow: 1,
        width: '100%'
    }
});
