import { useFindEventQuery } from "@/state/redux/api/wildEventsApi";
import { selectAuthUsername } from "@/state/redux/auth/authSlice";
import { useAppSelector } from "@/state/redux/hooks";

export function useIsEventAdmin(eventId: string | null): boolean {
    const username = useAppSelector(selectAuthUsername);
    const { data: event, isLoading: isEventLoading, isFetching: isEventFetching } =
        useFindEventQuery({ eventId: eventId ?? '' }, { skip: eventId === null });
    if (isEventLoading || isEventFetching || !event)
        return false;
    else
        return event.admins.indexOf(username ?? '') >= 0;
}
