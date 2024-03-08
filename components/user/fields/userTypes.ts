import { User } from '../../../state/redux/api/wildEventsApi';

export type RegisterUser = User & {
    confirmPassword: string;
}
