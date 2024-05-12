const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
  VOLUNTEER: "VOLUNTEER",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export default Roles;
