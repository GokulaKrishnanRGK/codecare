import type { Vaccination } from "../vaccinations/Vaccination";

export interface MyProfile {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: "USER" | "ADMIN" | "VOLUNTEER";
  vaccinations: Vaccination[];
  emailSubscribed: boolean;
}
