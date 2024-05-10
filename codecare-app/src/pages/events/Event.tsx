import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

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
  Typography,
} from "@mui/material";
import {ArrowBackRounded} from "@mui/icons-material";

import EditEvent from "./EditEvent";
import {getUser} from "../../store/loginUser-slice";
import * as authUtil from "../../utils/auth-util";
import Roles from "../../models/auth/Roles";

import {useGetEventByIdQuery} from "../../store/api/eventsApi";

function formatDateTime(dateIso: string): string {
  return new Date(dateIso).toLocaleString();
}

export default function EventPage(): JSX.Element {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useSelector(getUser());
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

  if (!eventId) {
    return (
        <Box sx={{p: 2}}>
          <Alert severity="error">Missing event id in route.</Alert>
        </Box>
    );
  }

  return (
      <Box sx={{p: 2}}>
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
                        <EditEvent editEvent={event} id={eventId}/>
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
                              image={event.eventImage || "/images/pwa-512x512.png"}
                              alt={event.title ? `Flyer for ${event.title}` : "Event flyer"}
                              loading="lazy"
                              sx={{
                                width: "100%",
                                maxHeight: 420,
                                objectFit: "cover",
                                borderRadius: 1,
                                backgroundColor: "grey.100",
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
