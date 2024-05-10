import {User} from "../models/auth/User.ts";

export function isUserInRole(user: User, roles: string[]): boolean {
    if(user) {
        const role = user.role;
        return roles.includes(role);
    }
    return false;
}