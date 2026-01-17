import {User} from "@/models/auth/User.ts";

export interface Activity {
  id: string;
  user: User;
  endpoint: string;
  method: string;
  date: string;
  status: number;
}