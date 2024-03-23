import { memo, useCallback, useState } from 'react';
import { selectEventIsDeleting } from '../../../state/redux/app/appSlice';
import { useAppSelector } from '../../../state/redux/hooks';
import HeaderActionButton from '../../ui/HeaderActionButton';
import ModifyEvent from '../ModifyEvent';

type Props = {
    eventId: string;
}

function EditEventButton({ eventId }: Readonly<Props>) {
    const isDeleting = useAppSelector(selectEventIsDeleting);
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = useCallback(() => setModalVisible(true), []);
    const hideModal = useCallback(() => setModalVisible(false), []);
    return (
        <>
            <HeaderActionButton
                mode='text'
                textKey='edit'
                icon='pencil'
                busy={isDeleting}
                onPress={showModal}
            />
            {modalVisible &&
                <ModifyEvent modalVisible={modalVisible} hideModal={hideModal} eventId={eventId} />
            }
        </>
    );
}

export default memo(EditEventButton);
