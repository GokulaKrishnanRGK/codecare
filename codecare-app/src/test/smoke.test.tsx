import {describe, it, expect} from "vitest";
import {renderWithProviders, screen} from "./test-utils";

function Hello() {
  return <div>Hello</div>;
}

describe("test harness", () => {
  it("renders with RTL and jest-dom", () => {
    renderWithProviders(<Hello/>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
