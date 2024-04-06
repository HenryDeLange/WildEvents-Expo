import { memo, useCallback, useState } from 'react';
import { selectActivityIsDeleting } from '../../../state/redux/app/appSlice';
import { useAppSelector } from '../../../state/redux/hooks';
import HeaderActionButton from '../../ui/HeaderActionButton';
import ModifyActivity from '../ModifyActivity';

type Props = {
    eventId: string;
    activityId: string;
}

function EditActivityButton({ eventId, activityId }: Readonly<Props>) {
    const isDeleting = useAppSelector(selectActivityIsDeleting);
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = useCallback(() => setModalVisible(true), []);
    const hideModal = useCallback(() => setModalVisible(false), []);
    return (
        <>
            <HeaderActionButton
                mode='text'
                textKey='edit'
                icon='pencil'
                disabled={isDeleting}
                onPress={showModal}
            />
            {modalVisible &&
                <ModifyActivity modalVisible={modalVisible} hideModal={hideModal} eventId={eventId} activityId={activityId} />
            }
        </>
    );
}

export default memo(EditActivityButton);
