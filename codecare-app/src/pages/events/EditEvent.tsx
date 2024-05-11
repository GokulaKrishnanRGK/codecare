import {useMemo, useState} from "react";

import type Event from "../../models/events/Event";
import EventForm from "./EventForm";
import type {EventFormState} from "../../models/events/EventFormTypes.ts";

import {useUpdateEventMutation} from "../../store/api/eventsApi";

interface EditEventProps {
  editEvent: Event;
  id: string;
  onDone: () => void;
  onSnack: (snack: { severity: "success" | "error"; message: string }) => void;
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
      address: ev.location?.address ?? "",
      city: ev.location?.city ?? "",
      state: ev.location?.state ?? "",
      country: ev.location?.country ?? "USA",
      postalCode: ev.location?.postalCode ?? "",
    },
  };
}

export default function EditEvent(props: Readonly<EditEventProps>): JSX.Element {
  const [updateEvent, {isLoading: isUpdating}] = useUpdateEventMutation();

  const initialValue = useMemo<EventFormState>(
      () => eventToFormState(props.editEvent),
      [props.editEvent]
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleUpdate = async (value: EventFormState): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("type", value.type);
      formData.append("title", value.title);
      formData.append("organizer", value.organizer);
      formData.append("description", value.description);
      formData.append("contactInfo", value.contactInfo);
      formData.append("date", value.date);
      formData.append("location", JSON.stringify(value.location));

      if (imageFile) formData.append("eventImage", imageFile);

      await updateEvent({id: props.id, body: formData}).unwrap();
      props.onSnack({severity: "success", message: "Event updated"});
      props.onDone();
    } catch {
      props.onSnack({severity: "error", message: "Event update failed"});
    }
  };

  return (
      <EventForm
          mode="edit"
          initialValue={initialValue}
          submitLabel={isUpdating ? "Updating..." : "Update Event"}
          onSubmit={handleUpdate}
          disabled={isUpdating}
          onFileChange={setImageFile}
      />
  );
}
