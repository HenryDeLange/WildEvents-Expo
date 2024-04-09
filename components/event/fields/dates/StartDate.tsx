import { addMonths, getYear, isAfter, subDays, subMonths } from 'date-fns';
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

function StartDate({ control, isLoading }: Readonly<Props>) {
    const { t } = useTranslation();
    const now = new Date();
    const stopDate = useWatch({ control, name: 'stop' });
    return (
        <GenericDate
            control={control}
            isLoading={isLoading}
            name='start'
            icon='calendar-arrow-right'
            label='eventStartDate'
            requiredMessage='eventStartDateRequired'
            startYear={getYear(subMonths(now, 3))}
            endYear={getYear(addMonths(now, 3))}
            validRange={{
                startDate: subMonths(now, 3),
                endDate: stopDate ? subDays(stopDate, 1) : addMonths(now, 3)
            }}
            overlap={(value: string) => (value && stopDate && !isAfter(stopDate, value)) ? t('eventStartDateError') : undefined}
        />
    );
}

export default StartDate;
