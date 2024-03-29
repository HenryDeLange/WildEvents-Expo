import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import ModifyEvent from '../ModifyEvent';

function CreateEventButton() {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = useCallback(() => setModalVisible(true), []);
    const hideModal = useCallback(() => setModalVisible(false), []);
    return (
        <>
            <Button
                mode='contained-tonal'
                uppercase
                icon='plus'
                onPress={showModal}
            >
                {t('eventCardCreateTitle')}
            </Button>
            {modalVisible &&
                <ModifyEvent modalVisible={modalVisible} hideModal={hideModal} />
            }
        </>
    );
}

export default memo(CreateEventButton);
