import {describe, it, expect} from "vitest";
import {
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@/test/mocks/auth";
import {renderWithProviders} from "@/test/render";
import VaccinationsAdmin from "../Vaccinations";
import {waitFor} from "@testing-library/react";


describe("VaccinationsAdmin", () => {
  it("renders table rows from API", async () => {
    renderWithProviders(<VaccinationsAdmin/>);

    expect(await screen.findByText("Vaccinations")).toBeInTheDocument();
    expect(await screen.findByText("Hepatitis B")).toBeInTheDocument();
    expect(screen.getByText("Tetanus")).toBeInTheDocument();
  });

  it("opens Add vaccination modal and enables Save only when fields are filled", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VaccinationsAdmin/>);

    await screen.findByText("Vaccinations");

    await user.click(screen.getByRole("button", {name: /add vaccination/i}));

    const modalTitle = await screen.findByRole("heading", {name: /add vaccination/i});
    expect(modalTitle).toBeInTheDocument();

    const modalRoot = modalTitle.closest("div")!;
    const modal = within(modalRoot);

    const save = modal.getByRole("button", {name: /^save$/i});
    expect(save).toBeDisabled();

    await user.type(modal.getByRole("textbox", {name: /name/i}), "Flu");
    expect(save).toBeDisabled();

    await user.type(modal.getByRole("textbox", {name: /description/i}), "Flu vaccine");
    expect(save).toBeEnabled();
  });

  it("submits create and closes modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VaccinationsAdmin/>);

    await screen.findByText("Vaccinations");
    await user.click(screen.getByRole("button", {name: /add vaccination/i}));

    const modalTitle = await screen.findByRole("heading", {name: /add vaccination/i});
    const modalRoot = modalTitle.closest("div")!;
    const modal = within(modalRoot);

    await user.type(modal.getByRole("textbox", {name: /name/i}), "Flu");
    await user.type(modal.getByRole("textbox", {name: /description/i}), "Flu vaccine");

    await user.click(modal.getByRole("button", {name: /^save$/i}));

    await waitFor(() => {
      expect(screen.queryByRole("heading", {name: /add vaccination/i})).not.toBeInTheDocument();
    });

    expect(screen.getByText("Vaccinations")).toBeInTheDocument();
  });

  it("Cancel closes modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VaccinationsAdmin/>);

    await screen.findByText("Vaccinations");
    await user.click(screen.getByRole("button", {name: /add vaccination/i}));

    const modalTitle = await screen.findByRole("heading", {name: /add vaccination/i});
    const modalRoot = modalTitle.closest("div")!;
    const modal = within(modalRoot);

    await user.click(modal.getByRole("button", {name: /cancel/i}));

    await waitFor(() => {
      expect(screen.queryByRole("heading", {name: /add vaccination/i})).not.toBeInTheDocument();
    });
  });
});
