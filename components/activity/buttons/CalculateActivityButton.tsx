import { memo, useCallback } from 'react';
import { useCalculateActivityMutation, useFindActivityQuery, wildEventsApi } from '../../../state/redux/api/wildEventsApi';
import { useAppDispatch, useAppSelector } from '../../../state/redux/hooks';
import HeaderActionButton from '../../ui/HeaderActionButton';
import { selectActivityIsDeleting } from '../../../state/redux/app/appSlice';

type Props = {
    activityId: string;
}

function CalculateActivityButton({ activityId }: Readonly<Props>) {
    const isDeleting = useAppSelector(selectActivityIsDeleting);
    const { disableReason } = useFindActivityQuery({ activityId }, {
        selectFromResult: ({ data }) => ({ disableReason: data?.disableReason })
    });
    const dispatch = useAppDispatch();
    const [doCalculate, { isLoading: isCalculating }] = useCalculateActivityMutation();
    const handleCalculate = useCallback(() => {
        doCalculate({ activityId });
        dispatch(wildEventsApi.util.invalidateTags(['Activities']));
    }, [activityId, dispatch, doCalculate]);
    return (
        <HeaderActionButton
            icon='calculator-variant-outline'
            textKey='activityCalculate'
            onPress={handleCalculate}
            busy={isCalculating}
            disabled={isCalculating || !!disableReason || isDeleting}
        />
    );
}

export default memo(CalculateActivityButton);
