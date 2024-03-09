import { memo, useCallback, useState } from 'react';
import HeaderActionButton from '../../ui/HeaderActionButton';
import ModifyEvent from '../ModifyEvent';

type Props = {
    eventId: string;
    disabled?: boolean;
}

function EditEventButton({ eventId, disabled }: Readonly<Props>) {
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = useCallback(() => setModalVisible(true), []);
    const hideModal = useCallback(() => setModalVisible(false), []);
    return (
        <>
            <HeaderActionButton
                mode='text'
                textKey='edit'
                icon='pencil'
                busy={disabled}
                onPress={showModal}
            />
            {modalVisible &&
                <ModifyEvent modalVisible={modalVisible} hideModal={hideModal} eventId={eventId} />
            }
        </>
    );
}

export default memo(EditEventButton);
