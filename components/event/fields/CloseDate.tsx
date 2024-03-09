import { addDays, addMonths, getYear } from 'date-fns';
import { Control, useWatch } from 'react-hook-form';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { EventBase } from '../../../state/redux/api/wildEventsApi';
import GenericDate from './GenericDate';

registerTranslation('en-GB', enGB);

type Props = {
    control: Control<EventBase, any>;
    isLoading?: boolean;
}

function CloseDate({ control, isLoading }: Readonly<Props>) {
    const stopDate = useWatch({ control, name: 'stop' });
    return (
        <GenericDate
            control={control}
            isLoading={isLoading}
            name='close'
            label='eventCloseDate'
            requiredMessage='eventCloseDateRequired'
            startYear={getYear(addDays(stopDate ?? '', 1))}
            endYear={getYear(addMonths(stopDate ?? '', 2))}
            validRange={{ startDate: addDays(stopDate ?? '', 1), endDate: addMonths(stopDate ?? '', 2) }}
            overlap={() => undefined}
        />
    );
}

export default CloseDate;
