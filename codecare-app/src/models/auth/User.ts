export interface User {
  id: string,
  clerkUserId: string;
  username: string,
  firstname: string,
  lastname: string,
  role: "USER" | "ADMIN",
}