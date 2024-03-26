import { addDays, addMonths, getYear, isAfter, subDays } from 'date-fns';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { EventBase } from '../../../../state/redux/api/wildEventsApi';
import GenericDate from './GenericDate';

registerTranslation('en-GB', enGB);

type Props = {
    control: Control<EventBase, any>;
    isLoading?: boolean;
}

function StopDate({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    const startDate = useWatch({ control, name: 'start' });
    const closeDate = useWatch({ control, name: 'close' });
    return (
        <GenericDate
            control={control}
            isLoading={isLoading}
            name='stop'
            icon='calendar-arrow-left'
            label='eventStopDate'
            requiredMessage='eventStopDateRequired'
            startYear={getYear(addDays(startDate ?? '', 1))}
            endYear={getYear(addMonths(startDate ?? '', 6))}
            validRange={{
                startDate: addDays(startDate ?? '', 1),
                endDate: closeDate ? subDays(closeDate, 1) : addMonths(startDate ?? '', 6)
            }}
            overlap={(value: string) => (closeDate && value && !isAfter(closeDate, value) ? t('eventStopDateError') : undefined)}
        />
    );
}

export default StopDate;
