import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import {ArrowBackRounded} from "@mui/icons-material";

import EditEvent from "./EditEvent";
import * as authUtil from "../../utils/auth-util";
import Roles from "../../models/auth/Roles";

import {useGetEventByIdQuery} from "../../store/api/eventsApi";
import {toPublicImageUrl} from "../../utils/image-url.ts";
import {useMeQuery} from "../../store/api/meApi.ts";
import {useAuth} from "@clerk/clerk-react";
import {skipToken} from "@reduxjs/toolkit/query";

function formatDateTime(dateIso: string): string {
  return new Date(dateIso).toLocaleString();
}

type FlashState = {
  snack?: {
    severity: "success" | "error";
    message: string;
  };
};

export default function EventPage(): JSX.Element {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isSignedIn } = useAuth();
  const { data: user } = useMeQuery(isSignedIn ? undefined : skipToken);
  const canAdmin = useMemo(
      () => authUtil.isUserInRole(user, [Roles.ADMIN]),
      [user]
  );

  const [editable, setEditable] = useState<boolean>(false);

  const eventId = id ?? "";
  const {
    data: event,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });

  const handleBack = (): void => navigate("/events");

  const handleToggleEdit = (): void => setEditable((prev) => !prev);

  const [snack, setSnack] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({open: false, severity: "success", message: ""});

  const closeSnack = (): void => setSnack((prev) => ({...prev, open: false}));

  useEffect(() => {
    const state = location.state as FlashState | null;

    if (state?.snack?.message) {
      setSnack({open: true, severity: state.snack.severity, message: state.snack.message});

      navigate(location.pathname, {replace: true, state: null});
    }
  }, [location.pathname, location.state, navigate]);

  if (!eventId) {
    return (
        <Box sx={{p: 2}}>
          <Alert severity="error">Missing event id in route.</Alert>
        </Box>
    );
  }

  return (
      <Box sx={{p: 2}}>
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
        <Card variant="outlined">
          <CardActions sx={{justifyContent: "space-between"}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <IconButton aria-label="Back to events" onClick={handleBack}>
                <ArrowBackRounded/>
              </IconButton>

              {(isLoading || isFetching) && (
                  <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <CircularProgress size={18}/>
                    <Typography variant="body2" color="text.secondary">
                      Loading…
                    </Typography>
                  </Box>
              )}
            </Box>

            {canAdmin && event && (
                <Button size="medium" onClick={handleToggleEdit}>
                  {editable ? "Cancel Edit" : "Edit Event"}
                </Button>
            )}
          </CardActions>

          <CardContent>
            {isError && (
                <Alert
                    severity="error"
                    action={
                      <Button color="inherit" size="small" onClick={() => refetch()}>
                        Retry
                      </Button>
                    }
                >
                  Failed to load event.
                </Alert>
            )}

            {!isError && !isLoading && !event && (
                <Alert severity="warning">Event not found.</Alert>
            )}

            {!isError && event && (
                <>
                  {editable ? (
                      <Box sx={{textAlign: "center"}}>
                        <EditEvent editEvent={event} id={eventId}
                                   onDone={() => setEditable(false)}
                                   onSnack={(s) => setSnack({open: true, ...s})}/>
                      </Box>
                  ) : (
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h4" component="h1" gutterBottom>
                            {event.title}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <CardMedia
                              component="img"
                              image={toPublicImageUrl(event.eventImage) ?? "/images/pwa-512x512.png"}
                              alt={event.title ? `Flyer for ${event.title}` : "Event flyer"}
                              loading="lazy"
                              sx={{
                                width: "100%",
                                maxHeight: 420,
                                objectFit: "cover",
                                borderRadius: 1
                              }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom>
                            About the event
                          </Typography>
                          <Typography variant="body1" sx={{whiteSpace: "pre-wrap"}}>
                            {event.description}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Location:</strong>{" "}
                            {event.location.address}, {event.location.city}{" "}
                            {event.location.postalCode}
                          </Typography>
                          <Typography variant="subtitle1">
                            <strong>Date:</strong> {formatDateTime(event.date)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Organized by:</strong> {event.organizer}
                          </Typography>
                          <Typography variant="subtitle1">
                            <strong>Contact:</strong> {event.contactInfo}
                          </Typography>
                        </Grid>
                      </Grid>
                  )}
                </>
            )}
          </CardContent>
        </Card>
      </Box>
  );
}
