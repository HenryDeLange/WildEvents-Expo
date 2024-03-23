import { memo, useCallback } from 'react';
import HeaderActionButton from '../../ui/HeaderActionButton';
import { useAppDispatch } from '../../../state/redux/hooks';
import { useCalculateEventMutation, wildEventsApi } from '../../../state/redux/api/wildEventsApi';

type Props = {
    eventId: string;
}

function CalculateEventButton({ eventId }: Readonly<Props>) {
    const dispatch = useAppDispatch();
    const [doCalculateEvent, { isLoading: isCalculating }] = useCalculateEventMutation();
    const handleCalculateEvent = useCallback(() => {
        doCalculateEvent({ eventId });
        dispatch(wildEventsApi.util.invalidateTags(['Activities']));
    }, [eventId, dispatch, doCalculateEvent]);
    return (
        <HeaderActionButton
            textKey='eventCalculate'
            icon='calculator-variant-outline'
            onPress={handleCalculateEvent}
            busy={isCalculating}
        />
    );
}

export default memo(CalculateEventButton);
