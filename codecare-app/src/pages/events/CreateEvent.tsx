import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import {ArrowBackRounded} from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";

import * as adminService from "../../services/admin-service";
import {getUsers, loadUsers} from "../../store/users-slice";
import type {ResponseObject} from "../../models/ResponseObject";
import type {User} from "../../models/auth/User";

import * as emailJsAPI from "../../utils/email-js-api";

import EventForm from "./EventForm";
import type {EventFormState} from "../../models/events/EventFormTypes.ts";
import {useCreateEventMutation} from "../../store/api/eventsApi";

const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID_EVENT;

const defaultFormState: EventFormState = {
  type: "",
  title: "",
  organizer: "",
  description: "",
  date: new Date().toISOString(),
  contactInfo: "",
  eventImage: "",
  location: {
    latitude: 0,
    longitude: 0,
    name: "Location Name",
    address: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
  },
};

export default function CreateEvent(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(getUsers);

  const [createEvent, {isLoading: isCreating}] = useCreateEventMutation();

  const [snack, setSnack] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({open: false, severity: "success", message: ""});

  const closeSnack = (): void =>
      setSnack((prev) => ({...prev, open: false}));

  useEffect(() => {
    adminService.searchUsers({}).then((response: ResponseObject<User[]>) => {
      if (response.data) dispatch(loadUsers(response.data));
    });
  }, [dispatch]);

  const handleCreate = async (payload: EventFormState): Promise<void> => {
    try {
      const created = await createEvent(payload).unwrap();

      const emails: string[] = [];
      const names: string[] = [];

      users.forEach((u) => {
        if (u.role !== "ADMIN") {
          emails.push(u.username);
          names.push(u.firstname);
        }
      });

      const templateParams = {
        to_name: names,
        to_email: emails,
        eventTitle: created.title,
        eventDesc: created.description,
        location: `${created.location.address}, ${created.location.city}, ${created.location.state} ${created.location.postalCode}`,
        eventLink: "/events/",
      };

      emailJsAPI.sendEmail(templateParams, TEMPLATE_ID);

      setSnack({open: true, severity: "success", message: "Event created"});

      navigate("/events");
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        message: "Event creation failed",
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
