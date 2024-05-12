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
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Typography
} from "@mui/material";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import {ArrowBackRounded} from "@mui/icons-material";

import EditEvent from "./EditEvent";

import {
  useGetEventByIdQuery,
  useRegisterForEventMutation,
  useUnregisterForEventMutation
} from "../../store/api/eventsApi";
import {toPublicImageUrl} from "../../utils/image-url.ts";
import RoleGate from "../../components/Auth/RoleGate.tsx";
import Roles from "../../models/auth/Roles.ts";

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

  const [registerForEvent, {isLoading: isRegistering}] = useRegisterForEventMutation();
  const [unregisterForEvent, {isLoading: isUnregistering}] = useUnregisterForEventMutation();

  const isBusy = isRegistering || isUnregistering;

  const isComplete = useMemo(() => {
    if (!event?.endTime) return false;
    return new Date(event.endTime).getTime() < Date.now();
  }, [event?.endTime]);

  const registered = event?.registeredCount ?? 0;
  const attended = event?.attendedCount ?? 0;

  const [imageOpen, setImageOpen] = useState(false);
  const openImage = () => setImageOpen(true);
  const closeImage = () => setImageOpen(false);


  const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 0;
  if (!eventId) {
    return (
        <Box sx={{p: 2}}>
          <Alert severity="error">Missing event id in route.</Alert>
        </Box>
    );
  }

  const imageSrc = toPublicImageUrl(event?.eventImage) ?? "/images/pwa-512x512.png";

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

            {event && (
                <>
                  <RoleGate allowedRoles={[Roles.ADMIN]}>
                    <Button size="medium" onClick={handleToggleEdit}>
                      {editable ? "Cancel Edit" : "Edit Event"}
                    </Button>
                  </RoleGate>

                  <RoleGate allowedRoles={[Roles.USER]}>
                    {!isComplete ? (
                        event.isRegistered ? (
                            <Button
                                variant="outlined"
                                disabled={isBusy}
                                onClick={() => unregisterForEvent({id: event.id})}
                            >
                              Unregister
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                disabled={isBusy}
                                onClick={() => registerForEvent({id: event.id})}
                            >
                              Register
                            </Button>
                        )
                    ) : (
                        <Button variant="outlined" disabled>
                          Registration closed
                        </Button>
                    )}
                  </RoleGate>

                  <RoleGate allowedRoles={[Roles.VOLUNTEER]}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/volunteer/events/${event.id}`)}
                    >
                      Manage vaccinations
                    </Button>
                  </RoleGate>
                </>
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
                          <Box
                              onClick={openImage}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") openImage();
                              }}
                              aria-label="Open event flyer"
                              sx={{
                                position: "relative",
                                borderRadius: 1,
                                overflow: "hidden",
                                cursor: "zoom-in",
                                outline: "none",
                                "&:focus-visible": {
                                  boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}40`,
                                },
                              }}
                          >
                            <CardMedia
                                component="img"
                                image={imageSrc}
                                alt={event.title ? `Flyer for ${event.title}` : "Event flyer"}
                                loading="lazy"
                                sx={{
                                  width: "100%",
                                  maxHeight: 420,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                            />

                            <Box
                                sx={{
                                  position: "absolute",
                                  right: 8,
                                  bottom: 8,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 999,
                                  bgcolor: "rgba(0,0,0,0.55)",
                                  color: "common.white",
                                  typography: "caption",
                                  userSelect: "none",
                                }}
                            >
                              <ZoomInRoundedIcon fontSize="small"/>
                              Click to enlarge
                            </Box>
                          </Box>

                          <Dialog
                              open={imageOpen}
                              onClose={closeImage}
                              maxWidth="lg"
                              fullWidth
                              aria-labelledby="event-flyer-dialog"
                          >
                            <Box
                                sx={{
                                  p: {xs: 1, sm: 2},
                                  bgcolor: "background.default",
                                }}
                            >
                              <Box
                                  component="img"
                                  src={imageSrc}
                                  alt={event.title ? `Flyer for ${event.title}` : "Event flyer"}
                                  sx={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "85vh",
                                    objectFit: "contain",
                                    display: "block",
                                    borderRadius: 1,
                                  }}
                              />
                            </Box>
                          </Dialog>
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
                            <strong>Date:</strong> {formatDateTime(event.date)} to {formatDateTime(event.endTime)}
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

                        <Grid item xs={12} md={6}>
                          <Box sx={{mt: 2}}>
                            <Typography variant="subtitle2">Stats</Typography>

                            <Typography variant="body2" color="text.secondary">
                              Registered: {event.registeredCount}
                            </Typography>

                            {isComplete && (
                                <>
                                  <Typography variant="body2" color="text.secondary">
                                    Attended: {event.attendedCount}
                                  </Typography>

                                  <Paper sx={{p: 2, mt: 2, borderRadius: 2}}>
                                    <Typography variant="h6" sx={{mb: 1}}>
                                      Attendance Summary
                                    </Typography>

                                    <Box sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5
                                    }}>
                                      <Typography variant="body2" color="text.secondary">
                                        Registered
                                      </Typography>
                                      <Typography variant="body2" sx={{fontWeight: 600}}>
                                        {registered}
                                      </Typography>
                                    </Box>

                                    <Box sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 1
                                    }}>
                                      <Typography variant="body2" color="text.secondary">
                                        Attended
                                      </Typography>
                                      <Typography variant="body2" sx={{fontWeight: 600}}>
                                        {attended}
                                      </Typography>
                                    </Box>

                                    <Box sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 0.5
                                    }}>
                                      <Typography variant="body2" color="text.secondary">
                                        Attendance rate
                                      </Typography>
                                      <Typography variant="body2" sx={{fontWeight: 700}}>
                                        {registered === 0 ? "—" : `${attendanceRate}%`}
                                      </Typography>
                                    </Box>

                                    <LinearProgress
                                        variant="determinate"
                                        value={registered === 0 ? 0 : (attended / registered) * 100}
                                        sx={{height: 10, borderRadius: 6}}
                                    />

                                    {registered === 0 && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{display: "block", mt: 1}}
                                        >
                                          No registrations were recorded for this event.
                                        </Typography>
                                    )}
                                  </Paper>
                                </>
                            )}
                          </Box>
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
