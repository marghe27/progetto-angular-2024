import { User } from "./user";

export interface AuthenticationResponse {
    token: string;
    user:User;
}