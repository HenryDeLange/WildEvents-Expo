import { baseSplitApi as api } from "./baseApi";
export const addTagTypes = [
  "Events",
  "Activities",
  "User Authentication",
  "WildEvents Version",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      findEvent: build.query<FindEventApiResponse, FindEventApiArg>({
        query: (queryArg) => ({ url: `/events/${queryArg.id}` }),
        providesTags: ["Events"],
      }),
      updateEvent: build.mutation<UpdateEventApiResponse, UpdateEventApiArg>({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}`,
          method: "PUT",
          body: queryArg.eventBase,
        }),
        invalidatesTags: ["Events"],
      }),
      deleteEvent: build.mutation<DeleteEventApiResponse, DeleteEventApiArg>({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Events"],
      }),
      findActivity: build.query<FindActivityApiResponse, FindActivityApiArg>({
        query: (queryArg) => ({ url: `/activities/${queryArg.id}` }),
        providesTags: ["Activities"],
      }),
      updateActivity: build.mutation<
        UpdateActivityApiResponse,
        UpdateActivityApiArg
      >({
        query: (queryArg) => ({
          url: `/activities/${queryArg.id}`,
          method: "PUT",
          body: queryArg.activityBase,
        }),
        invalidatesTags: ["Activities"],
      }),
      deleteActivity: build.mutation<
        DeleteActivityApiResponse,
        DeleteActivityApiArg
      >({
        query: (queryArg) => ({
          url: `/activities/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Activities"],
      }),
      register: build.mutation<RegisterApiResponse, RegisterApiArg>({
        query: (queryArg) => ({
          url: `/users/register`,
          method: "POST",
          body: queryArg.user,
        }),
        invalidatesTags: ["User Authentication"],
      }),
      refresh: build.mutation<RefreshApiResponse, RefreshApiArg>({
        query: () => ({ url: `/users/refresh`, method: "POST" }),
        invalidatesTags: ["User Authentication"],
      }),
      login: build.mutation<LoginApiResponse, LoginApiArg>({
        query: (queryArg) => ({
          url: `/users/login`,
          method: "POST",
          body: queryArg.userLogin,
        }),
        invalidatesTags: ["User Authentication"],
      }),
      findEvents: build.query<FindEventsApiResponse, FindEventsApiArg>({
        query: (queryArg) => ({
          url: `/events`,
          params: {
            page: queryArg.page,
            requestContinuation: queryArg.requestContinuation,
          },
        }),
        providesTags: ["Events"],
      }),
      createEvent: build.mutation<CreateEventApiResponse, CreateEventApiArg>({
        query: (queryArg) => ({
          url: `/events`,
          method: "POST",
          body: queryArg.eventBase,
        }),
        invalidatesTags: ["Events"],
      }),
      participantJoinEvent: build.mutation<
        ParticipantJoinEventApiResponse,
        ParticipantJoinEventApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}/participants/${queryArg.iNatId}`,
          method: "POST",
        }),
        invalidatesTags: ["Events"],
      }),
      participantLeaveEvent: build.mutation<
        ParticipantLeaveEventApiResponse,
        ParticipantLeaveEventApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}/participants/${queryArg.iNatId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Events"],
      }),
      calculateEvent: build.mutation<
        CalculateEventApiResponse,
        CalculateEventApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}/calculate`,
          method: "POST",
        }),
        invalidatesTags: ["Events"],
      }),
      adminJoinEvent: build.mutation<
        AdminJoinEventApiResponse,
        AdminJoinEventApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}/admins/${queryArg.adminId}`,
          method: "POST",
        }),
        invalidatesTags: ["Events"],
      }),
      adminLeaveEvent: build.mutation<
        AdminLeaveEventApiResponse,
        AdminLeaveEventApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}/admins/${queryArg.adminId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Events"],
      }),
      findActivities: build.query<
        FindActivitiesApiResponse,
        FindActivitiesApiArg
      >({
        query: (queryArg) => ({
          url: `/activities`,
          params: {
            eventId: queryArg.eventId,
            page: queryArg.page,
            requestContinuation: queryArg.requestContinuation,
          },
        }),
        providesTags: ["Activities"],
      }),
      createActivity: build.mutation<
        CreateActivityApiResponse,
        CreateActivityApiArg
      >({
        query: (queryArg) => ({
          url: `/activities`,
          method: "POST",
          body: queryArg.activityCreate,
        }),
        invalidatesTags: ["Activities"],
      }),
      calculateActivity: build.mutation<
        CalculateActivityApiResponse,
        CalculateActivityApiArg
      >({
        query: (queryArg) => ({
          url: `/activities/${queryArg.id}/calculate`,
          method: "POST",
        }),
        invalidatesTags: ["Activities"],
      }),
      getVersion: build.query<GetVersionApiResponse, GetVersionApiArg>({
        query: () => ({ url: `/version` }),
        providesTags: ["WildEvents Version"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as wildEventsApi };
export type FindEventApiResponse = /** status 200 OK */ Event;
export type FindEventApiArg = {
  id: string;
};
export type UpdateEventApiResponse = /** status 200 OK */ Event;
export type UpdateEventApiArg = {
  id: string;
  eventBase: EventBase;
};
export type DeleteEventApiResponse = unknown;
export type DeleteEventApiArg = {
  id: string;
};
export type FindActivityApiResponse = /** status 200 OK */ Activity;
export type FindActivityApiArg = {
  id: string;
};
export type UpdateActivityApiResponse = /** status 200 OK */ Activity;
export type UpdateActivityApiArg = {
  id: string;
  activityBase: ActivityBase;
};
export type DeleteActivityApiResponse = unknown;
export type DeleteActivityApiArg = {
  id: string;
};
export type RegisterApiResponse = /** status 200 OK */ Tokens;
export type RegisterApiArg = {
  user: User;
};
export type RefreshApiResponse = /** status 200 OK */ Tokens;
export type RefreshApiArg = void;
export type LoginApiResponse = /** status 200 OK */ Tokens;
export type LoginApiArg = {
  userLogin: UserLogin;
};
export type FindEventsApiResponse = /** status 200 OK */ PagedEvent;
export type FindEventsApiArg = {
  page?: number;
  requestContinuation?: string;
};
export type CreateEventApiResponse = /** status 200 OK */ Event;
export type CreateEventApiArg = {
  eventBase: EventBase;
};
export type ParticipantJoinEventApiResponse = /** status 200 OK */ Event;
export type ParticipantJoinEventApiArg = {
  id: string;
  iNatId: string;
};
export type ParticipantLeaveEventApiResponse = /** status 200 OK */ Event;
export type ParticipantLeaveEventApiArg = {
  id: string;
  iNatId: string;
};
export type CalculateEventApiResponse = unknown;
export type CalculateEventApiArg = {
  id: string;
};
export type AdminJoinEventApiResponse = /** status 200 OK */ Event;
export type AdminJoinEventApiArg = {
  id: string;
  adminId: string;
};
export type AdminLeaveEventApiResponse = /** status 200 OK */ Event;
export type AdminLeaveEventApiArg = {
  id: string;
  adminId: string;
};
export type FindActivitiesApiResponse = /** status 200 OK */ PagedActivity;
export type FindActivitiesApiArg = {
  eventId: string;
  page?: number;
  requestContinuation?: string;
};
export type CreateActivityApiResponse = /** status 200 OK */ Activity;
export type CreateActivityApiArg = {
  activityCreate: ActivityCreate;
};
export type CalculateActivityApiResponse = /** status 200 OK */ Activity;
export type CalculateActivityApiArg = {
  id: string;
};
export type GetVersionApiResponse = /** status 200 OK */ Version;
export type GetVersionApiArg = void;
export type Event = {
  name: string;
  description?: string;
  start: string;
  stop: string;
  close: string;
  visibility: "PUBLIC" | "PRIVATE";
  id: string;
  admins: string[];
  participants?: string[];
};
export type EventBase = {
  name: string;
  description?: string;
  start: string;
  stop: string;
  close: string;
  visibility: "PUBLIC" | "PRIVATE";
};
export type ActivityCalculation = {
  score?: number;
  observations?: number[];
};
export type Activity = {
  name: string;
  description?: string;
  status?: "PENDING" | "CALCULATING" | "CALCULATED" | "ERROR";
  disableReason?: "FAILED_TO_CALCULATE" | "TOO_MANY_RESULTS" | "ADMIN_DISABLED";
  criteria?: {
    [key: string]: string;
  }[];
  eventId: string;
  type: "RACE" | "HUNT" | "QUIZ" | "EXPLORE";
  id: string;
  calculated?: string;
  results?: {
    [key: string]: ActivityCalculation;
  }[];
};
export type ActivityBase = {
  name: string;
  description?: string;
  status?: "PENDING" | "CALCULATING" | "CALCULATED" | "ERROR";
  disableReason?: "FAILED_TO_CALCULATE" | "TOO_MANY_RESULTS" | "ADMIN_DISABLED";
  criteria?: {
    [key: string]: string;
  }[];
};
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
export type User = {
  username: string;
  password: string;
  inaturalist: string;
};
export type UserLogin = {
  username: string;
  password: string;
};
export type PagedEvent = {
  pageNumber?: number;
  pageSize?: number;
  totalRecords?: number;
  data?: Event[];
  firstPage?: boolean;
  lastPage?: boolean;
  requestContinuation?: string;
};
export type PagedActivity = {
  pageNumber?: number;
  pageSize?: number;
  totalRecords?: number;
  data?: Activity[];
  firstPage?: boolean;
  lastPage?: boolean;
  requestContinuation?: string;
};
export type ActivityCreate = {
  name: string;
  description?: string;
  status?: "PENDING" | "CALCULATING" | "CALCULATED" | "ERROR";
  disableReason?: "FAILED_TO_CALCULATE" | "TOO_MANY_RESULTS" | "ADMIN_DISABLED";
  criteria?: {
    [key: string]: string;
  }[];
  eventId: string;
  type: "RACE" | "HUNT" | "QUIZ" | "EXPLORE";
};
export type Version = {
  appVersion: string;
};
export const {
  useFindEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useFindActivityQuery,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLoginMutation,
  useFindEventsQuery,
  useCreateEventMutation,
  useParticipantJoinEventMutation,
  useParticipantLeaveEventMutation,
  useCalculateEventMutation,
  useAdminJoinEventMutation,
  useAdminLeaveEventMutation,
  useFindActivitiesQuery,
  useCreateActivityMutation,
  useCalculateActivityMutation,
  useGetVersionQuery,
} = injectedRtkApi;