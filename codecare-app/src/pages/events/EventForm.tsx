import * as React from "react";
import {useMemo, useState} from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {FormLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import Input from "@mui/material/Input";

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

import dayjs, {Dayjs} from "dayjs";

import type {EventFormState, EventFormMode} from "../../models/events/EventFormTypes.ts";

interface EventFormProps {
  mode: EventFormMode;
  initialValue: EventFormState;
  submitLabel: string;
  disabled?: boolean;
  onSubmit: (value: EventFormState) => Promise<void> | void;
}

const EVENT_TYPES: string[] = [
  "General Health Checkup Camp",
  "Vaccination Camp",
  "Blood Donation Camp",
  "Dental Camp",
  "Eye Care Camp",
  "Diabetes Screening Camp",
  "Cancer Screening Camp",
  "Orthopedic Camp",
  "Pediatric Camp",
  "Women's Health Camp",
];

function safeIso(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export default function EventForm(props: Readonly<EventFormProps>): JSX.Element {
  const {initialValue, submitLabel, disabled = false, onSubmit} = props;

  const [form, setForm] = useState<EventFormState>(() => ({
    ...initialValue,
    date: safeIso(initialValue.date),
  }));

  const dateValue: Dayjs = useMemo(() => dayjs(form.date), [form.date]);

  const setField = (key: keyof EventFormState, value: EventFormState[keyof EventFormState]): void => {
    setForm((prev) => ({...prev, [key]: value}));
  };

  const setLocationField = (
      key: keyof EventFormState["location"],
      value: EventFormState["location"][keyof EventFormState["location"]]
  ): void => {
    setForm((prev) => ({...prev, location: {...prev.location, [key]: value}}));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = typeof reader.result === "string" ? reader.result : "";
      setField("eventImage", base64);
    };
    reader.onerror = () => {
      console.error("Failed to read image");
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{maxWidth: 820, mx: "auto", textAlign: "left"}}>
          <Grid item xs={12} md={6}>
            <FormLabel htmlFor="title" required>
              Title
            </FormLabel>
            <OutlinedInput
                id="title"
                name="title"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Title"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="description" required sx={{mt: 2, display: "block"}}>
              Description
            </FormLabel>
            <OutlinedInput
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Description"
                multiline
                minRows={6}
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="organizer" required sx={{mt: 2, display: "block"}}>
              Name of the Organizer
            </FormLabel>
            <OutlinedInput
                id="organizer"
                name="organizer"
                value={form.organizer}
                onChange={(e) => setField("organizer", e.target.value)}
                placeholder="Organizer"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="contactInfo" required sx={{mt: 2, display: "block"}}>
              Contact
            </FormLabel>
            <OutlinedInput
                id="contactInfo"
                name="contactInfo"
                value={form.contactInfo}
                onChange={(e) => setField("contactInfo", e.target.value)}
                placeholder="Contact"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="eventImage" sx={{mt: 2, display: "block"}}>
              Add Flyer
            </FormLabel>
            <Input
                type="file"
                accept="image/*"
                id="eventImage"
                name="eventImage"
                onChange={handleFileUpload}
                disabled={disabled}
                sx={{mt: 1}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormLabel htmlFor="type" required>
              Event Type
            </FormLabel>
            <Select
                id="type"
                name="type"
                value={form.type}
                onChange={(e) => setField("type", String(e.target.value))}
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            >
              {EVENT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
              ))}
            </Select>

            <FormLabel sx={{mt: 2, display: "block"}} required>
              Date
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                  label="Event Date"
                  value={dateValue}
                  onChange={(v) => {
                    const next = v?.toDate();
                    if (next) setField("date", next.toISOString());
                  }}
                  disablePast
                  disabled={disabled}
                  sx={{mt: 1, width: "100%"}}
              />
            </LocalizationProvider>

            <FormLabel htmlFor="address" required sx={{mt: 2, display: "block"}}>
              Address
            </FormLabel>
            <OutlinedInput
                id="address"
                name="address"
                value={form.location.address}
                onChange={(e) => setLocationField("address", e.target.value)}
                placeholder="Address"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="city" required sx={{mt: 2, display: "block"}}>
              City
            </FormLabel>
            <OutlinedInput
                id="city"
                name="city"
                value={form.location.city}
                onChange={(e) => setLocationField("city", e.target.value)}
                placeholder="City"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="state" required sx={{mt: 2, display: "block"}}>
              State
            </FormLabel>
            <OutlinedInput
                id="state"
                name="state"
                value={form.location.state}
                onChange={(e) => setLocationField("state", e.target.value)}
                placeholder="State"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />

            <FormLabel htmlFor="postalCode" required sx={{mt: 2, display: "block"}}>
              Postal Code
            </FormLabel>
            <OutlinedInput
                id="postalCode"
                name="postalCode"
                value={form.location.postalCode}
                onChange={(e) => setLocationField("postalCode", e.target.value)}
                placeholder="Postal Code"
                fullWidth
                required
                disabled={disabled}
                sx={{mt: 1}}
            />
          </Grid>

          <Grid item xs={12} sx={{mt: 1}}>
            <Button type="submit" variant="contained" disabled={disabled}>
              {submitLabel}
            </Button>
          </Grid>
        </Grid>
      </form>
  );
}
