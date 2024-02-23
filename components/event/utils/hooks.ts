import { format, isAfter } from 'date-fns';
import { useFindEventQuery } from '../../../state/redux/api/wildEventsApi';
import { selectAuthUsername } from '../../../state/redux/auth/authSlice';
import { useAppSelector } from '../../../state/redux/hooks';

export function useIsEventAdmin(eventId: string | null): boolean {
    const username = useAppSelector(selectAuthUsername);
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } =
        useFindEventQuery({ eventId: eventId ?? '' }, { skip: eventId === null });
    if (isEventLoading || isEventFetching || !event)
        return false;
    else
        return (event.admins.indexOf(username ?? '') >= 0)
            && (!event.close || isAfter(format(event.close, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')));
}
