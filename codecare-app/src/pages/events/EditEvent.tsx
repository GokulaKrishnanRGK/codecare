import {useMemo, useState} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import type Event from "../../models/events/Event";
import EventForm from "./EventForm";
import type {EventFormState} from "../../models/events/EventFormTypes.ts";

import {useUpdateEventMutation} from "../../store/api/eventsApi";

interface EditEventProps {
  editEvent: Event;
  id: string;
}

function eventToFormState(ev: Event): EventFormState {
  return {
    type: ev.type ?? "",
    title: ev.title ?? "",
    organizer: ev.organizer ?? "",
    description: ev.description ?? "",
    date: ev.date,
    contactInfo: ev.contactInfo ?? "",
    eventImage: ev.eventImage ?? "",
    location: {
      latitude: ev.location?.latitude ?? 0,
      longitude: ev.location?.longitude ?? 0,
      name: ev.location?.name ?? "Location Name",
      address: ev.location?.address ?? "",
      city: ev.location?.city ?? "",
      state: ev.location?.state ?? "",
      country: ev.location?.country ?? "USA",
      postalCode: ev.location?.postalCode ?? "",
    },
  };
}

export default function EditEvent(props: EditEventProps): JSX.Element {
  const [updateEvent, {isLoading: isUpdating}] = useUpdateEventMutation();

  const initialValue = useMemo<EventFormState>(
      () => eventToFormState(props.editEvent),
      [props.editEvent]
  );

  const [snack, setSnack] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({open: false, severity: "success", message: ""});

  const closeSnack = (): void =>
      setSnack((prev) => ({...prev, open: false}));

  const handleUpdate = async (value: EventFormState): Promise<void> => {
    try {
      const body: Partial<EventFormState> = {
        ...value,
        eventImage: value.eventImage || initialValue.eventImage,
      };

      await updateEvent({id: props.id, body}).unwrap();
      setSnack({open: true, severity: "success", message: "Event updated"});
    } catch {
      setSnack({open: true, severity: "error", message: "Event update failed"});
    }
  };

  return (
      <>
        <EventForm
            mode="edit"
            initialValue={initialValue}
            submitLabel={isUpdating ? "Updating..." : "Update Event"}
            onSubmit={handleUpdate}
            disabled={isUpdating}
        />

        <Snackbar
            open={snack.open}
            autoHideDuration={3000}
            onClose={closeSnack}
            anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        >
          <Alert onClose={closeSnack} severity={snack.severity} variant="filled">
            {snack.message}
          </Alert>
        </Snackbar>
      </>
  );
}
