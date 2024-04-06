import { memo, useCallback } from 'react';
import HeaderActionButton from '../../ui/HeaderActionButton';
import { useAppDispatch, useAppSelector } from '../../../state/redux/hooks';
import { useCalculateEventMutation, wildEventsApi } from '../../../state/redux/api/wildEventsApi';
import { selectEventIsDeleting } from '../../../state/redux/app/appSlice';

type Props = {
    eventId: string;
}

function CalculateEventButton({ eventId }: Readonly<Props>) {
    const isDeleting = useAppSelector(selectEventIsDeleting);
    const dispatch = useAppDispatch();
    const [doCalculate, { isLoading: isCalculating }] = useCalculateEventMutation();
    const handleCalculate = useCallback(() => {
        doCalculate({ eventId });
        dispatch(wildEventsApi.util.invalidateTags(['Activities']));
    }, [eventId, dispatch, doCalculate]);
    return (
        <HeaderActionButton
            textKey='eventCalculate'
            icon='calculator-variant-outline'
            onPress={handleCalculate}
            busy={isCalculating}
            disabled={isCalculating || isDeleting}
        />
    );
}

export default memo(CalculateEventButton);
