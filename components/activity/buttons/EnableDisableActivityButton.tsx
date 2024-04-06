import { memo, useCallback } from 'react';
import { useDisableActivityMutation, useEnableActivityMutation, useFindActivityQuery } from '../../../state/redux/api/wildEventsApi';
import { selectActivityIsDeleting } from '../../../state/redux/app/appSlice';
import { useAppSelector } from '../../../state/redux/hooks';
import HeaderActionButton from '../../ui/HeaderActionButton';

type Props = {
    activityId: string;
}

function EnableDisableActivityButton({ activityId }: Readonly<Props>) {
    const isDeleting = useAppSelector(selectActivityIsDeleting);
    const { disableReason } = useFindActivityQuery({ activityId }, {
        selectFromResult: ({ data }) => ({ disableReason: data?.disableReason })
    });
    const [doEnable, { isLoading: isEnabling }] = useEnableActivityMutation();
    const [doDisable, { isLoading: isDisabling }] = useDisableActivityMutation();
    const handleEnable = useCallback(() => doEnable({ activityId }), [activityId]);
    const handleDisable = useCallback(() => doDisable({ activityId }), [activityId]);
    return (
        <HeaderActionButton
            icon={disableReason ? 'check-circle-outline' : 'minus-circle-outline'}
            textKey={disableReason ? 'activityEnable' : 'activityDisable'}
            onPress={disableReason ? handleEnable : handleDisable}
            busy={isEnabling || isDisabling}
            disabled={isEnabling || isDisabling || isDeleting}
        />
    );
}

export default memo(EnableDisableActivityButton);
