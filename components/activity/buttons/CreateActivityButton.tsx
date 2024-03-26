import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import ModifyActivity from '../ModifyActivity';

type Props = {
    eventId: string;
}

function CreateActivityButton({ eventId }: Readonly<Props>) {
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
                disabled={!eventId}
                onPress={showModal}
            >
                {t('activityCardCreateTitle')}
            </Button>
            {modalVisible &&
                <ModifyActivity modalVisible={modalVisible} hideModal={hideModal} eventId={eventId} />
            }
        </>
    );
}

export default memo(CreateActivityButton);
