import {User} from "../models/auth/User.ts";

export function isUserInRole(user: User | undefined | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}