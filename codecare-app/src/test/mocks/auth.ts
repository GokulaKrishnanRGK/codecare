import * as React from "react";
import { vi } from "vitest";

vi.mock("@/components/Auth/AuthGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
}));

vi.mock("@/components/Auth/RoleGate", () => ({
  default: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
}));
