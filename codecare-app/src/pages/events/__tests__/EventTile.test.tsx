import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type Event from "../../../models/events/Event";
import "@/test/mocks/auth";
import EventTile from "../../../components/Event/EventTile";

const sampleEvent: Event = {
  id: "e1",
  title: "Sample Event",
  description: "Desc",
  date: new Date(Date.now() + 86400000).toISOString(),
  endTime: new Date(Date.now() + 87400000).toISOString(),
  organizer: "Org",
  contactInfo: "1234567890",
  eventImage: "events/sample.png",
  type: "Sample",
  location: {
    address: "Addr",
    city: "City",
    state: "State",
    country: "USA",
    postalCode: "12345",
  },
  registeredCount: 2,
  attendedCount: 0,
  isRegistered: true,
};

describe("EventTile", () => {
  it("calls onOpen when the tile is clicked", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onDelete = vi.fn();

    render(
        <EventTile event={sampleEvent} onOpen={onOpen} onRequestDelete={onDelete} />
    );

    await user.click(
        screen.getByRole("button", { name: /open event sample event/i })
    );

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith("e1");
  });

  it("shows Registered chip when user is registered", () => {
    render(
        <EventTile event={sampleEvent} onOpen={() => {}} onRequestDelete={() => {}} />
    );

    expect(screen.getByText(/^Registered$/i)).toBeInTheDocument();
  });

  it("clicking View details calls onOpen", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(
        <EventTile event={sampleEvent} onOpen={onOpen} onRequestDelete={() => {}} />
    );

    await user.click(screen.getByRole("button", { name: /view details/i }));

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith("e1");
  });

  it("clicking Delete calls onRequestDelete and does NOT call onOpen", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onDelete = vi.fn();

    render(
        <EventTile event={sampleEvent} onOpen={onOpen} onRequestDelete={onDelete} />
    );

    await user.click(
        screen.getByRole("button", { name: /delete event sample event/i })
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("e1");
    expect(onOpen).not.toHaveBeenCalled();
  });
});
