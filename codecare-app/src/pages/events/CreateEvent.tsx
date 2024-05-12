import {useState} from "react";
import {useNavigate} from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import {ArrowBackRounded} from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";

import EventForm from "./EventForm";
import type {EventFormState} from "../../models/events/EventFormTypes.ts";
import {useCreateEventMutation} from "../../store/api/eventsApi";
import type Event from "../../models/events/Event";
import {getApiErrorMessage} from "../../store/api/apiTypes.ts";

const defaultFormState: EventFormState = {
  type: "",
  title: "",
  organizer: "",
  description: "",
  date: new Date().toISOString(),
  endTime: new Date().toISOString(),
  contactInfo: "",
  eventImage: "",
  location: {
    address: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
  },
};

export default function CreateEvent(): JSX.Element {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [createEvent, {isLoading: isCreating}] = useCreateEventMutation();

  const [snack, setSnack] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({open: false, severity: "success", message: ""});

  const closeSnack = (): void =>
      setSnack((prev) => ({...prev, open: false}));

  const handleCreate = async (payload: EventFormState): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("type", payload.type);
      formData.append("title", payload.title);
      formData.append("organizer", payload.organizer);
      formData.append("description", payload.description);
      formData.append("contactInfo", payload.contactInfo);
      formData.append("date", payload.date);
      formData.append("endTime", payload.endTime);

      formData.append("location", JSON.stringify(payload.location));

      if (imageFile) formData.append("eventImage", imageFile);

      const created: Event = await createEvent(formData).unwrap();

      setSnack({open: true, severity: "success", message: "Event created"});

      navigate(`/events/${created.id}`, {
        state: {snack: {severity: "success", message: "Event created"}},
      });
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        message: getApiErrorMessage(err),
      });
    }
  };

  return (
      <AuthGuard allowedRoles={[Roles.ADMIN]}>
        <Card variant="outlined">
          <CardActions>
            <IconButton aria-label="Back to events" onClick={() => navigate("/events")}>
              <ArrowBackRounded/>
            </IconButton>
          </CardActions>

          <CardContent sx={{textAlign: "center"}}>
            <h2>Create Event</h2>

            <EventForm
                mode="create"
                initialValue={defaultFormState}
                submitLabel={isCreating ? "Creating..." : "Create Event"}
                onSubmit={handleCreate}
                disabled={isCreating}
                onFileChange={setImageFile}
            />
          </CardContent>

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
        </Card>
      </AuthGuard>
  );
}
