import "whatwg-fetch";
import "@testing-library/jest-dom/vitest";

import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "./msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

const g: any = globalThis;
if (!g.TextEncoder) {
  const { TextEncoder, TextDecoder } = await import("node:util");
  g.TextEncoder = TextEncoder;
  g.TextDecoder = TextDecoder;
}

vi.mock("react-i18next", async () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

type ClerkState = {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
};

const clerkState: ClerkState = {
  isLoaded: true,
  isSignedIn: true,
  userId: "test_clerk_user",
};

export function __setClerkState(next: Partial<ClerkState>) {
  Object.assign(clerkState, next);
}

vi.mock("@clerk/clerk-react", async () => ({
  useAuth: () => ({
    isSignedIn: clerkState.isSignedIn,
    userId: clerkState.userId,
    getToken: vi.fn(async () => "test_token"),
  }),
  useUser: () => ({
    isLoaded: clerkState.isLoaded,
    isSignedIn: clerkState.isSignedIn,
    user: clerkState.isSignedIn ? { id: clerkState.userId } : null,
  }),
  SignedIn: ({ children }: { children: any }) =>
      clerkState.isSignedIn ? children : null,
  SignedOut: ({ children }: { children: any }) =>
      !clerkState.isSignedIn ? children : null,
  UserButton: () => null,
}));
