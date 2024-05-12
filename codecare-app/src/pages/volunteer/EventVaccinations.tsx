import * as React from "react";
import {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";
import ListToolbar from "../../components/common/ListToolbar";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {InfinitySpin} from "react-loader-spinner";
import {
  useAddVaccinationForUserMutation,
  useGetEventRegistrationsQuery,
} from "../../store/api/volunteerApi";
import Button from "@mui/material/Button";
import {ArrowBackRounded} from "@mui/icons-material";

export default function EventVaccinations(): JSX.Element {
  const navigate = useNavigate();
  const {id} = useParams();
  const eventId = id ?? "";

  const {data, isLoading, isFetching, isError, refetch} = useGetEventRegistrationsQuery(
      {eventId},
      {skip: !eventId}
  );

  const [addVaccination, {isLoading: isSaving}] = useAddVaccinationForUserMutation();

  const showLoader = isLoading || isFetching;
  const users = data?.users ?? [];
  const vaccinations = data?.vaccinations ?? [];

  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const selectedUser = useMemo(
      () => users.find((u) => u.id === selectedUserId) ?? null,
      [users, selectedUserId]
  );

  const selectedUserVaccinationIds = useMemo(() => {
    const set = new Set<string>();
    (selectedUser?.vaccinations ?? []).forEach((v) => set.add(v.id));
    return set;
  }, [selectedUser]);

  type PendingAction = { vaccinationId: string; vaccinationName: string };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const openConfirm = (vaccinationId: string, vaccinationName: string) => {
    setPending({vaccinationId, vaccinationName});
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (isSaving) return;
    setConfirmOpen(false);
    setPending(null);
  };

  const confirmAdd = async () => {
    if (!selectedUser || !pending) return;

    await addVaccination({
      eventId,
      userId: selectedUser.id,
      vaccinationId: pending.vaccinationId,
    }).unwrap();

    closeConfirm();
  };

  const handleBack = (): void => {
    if (eventId) {
      navigate(`/events/${eventId}`);
    } else {
      navigate("/events");
    }
  };

  return (
      <AuthGuard allowedRoles={[Roles.VOLUNTEER]}>
        <>
          <ListToolbar
              title={data?.event?.title ? `Event: ${data.event.title}` : "Event"}
              onRefresh={refetch}
              isRefreshing={showLoader}
              refreshLabel="Refresh registrations"
              right={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton aria-label="Back to event" onClick={handleBack}>
                    <ArrowBackRounded />
                  </IconButton>

                  {showLoader && (
                      <Typography variant="body2" color="text.secondary">
                        Loading…
                      </Typography>
                  )}
                </Box>
              }
          />

          <Dialog open={confirmOpen} onClose={closeConfirm}>
            <DialogTitle>Confirm vaccination</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Mark <b>{pending?.vaccinationName}</b> as given for{" "}
                <b>
                  {selectedUser
                      ? `${selectedUser.firstname} ${selectedUser.lastname}`.trim() || selectedUser.username
                      : "this user"}
                </b>
                ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeConfirm} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={confirmAdd} variant="contained"
                      disabled={isSaving || !pending || !selectedUser}>
                {isSaving ? "Saving..." : "Confirm"}
              </Button>
            </DialogActions>
          </Dialog>


          {showLoader && (
              <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
                <InfinitySpin/>
              </Box>
          )}

          {isError && !showLoader && (
              <Paper sx={{p: 2}}>
                <Typography>Failed to load registrations.</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try refreshing.
                </Typography>
              </Paper>
          )}

          {!showLoader && !isError && (
              <Stack direction={{xs: "column", md: "row"}} spacing={2}>
                <Paper sx={{flex: 1, p: 2, borderRadius: 2}}>
                  <Typography variant="h6" sx={{mb: 1}}>
                    Registered users ({users.length})
                  </Typography>

                  {users.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No registrations yet.
                      </Typography>
                  ) : (
                      <List dense>
                        {users.map((u) => (
                            <React.Fragment key={u.id}>
                              <ListItemButton
                                  selected={u.id === selectedUserId}
                                  onClick={() => setSelectedUserId(u.id)}
                              >
                                <ListItemText
                                    primary={`${u.firstname} ${u.lastname}`.trim() || "Unnamed user"}
                                    secondary={u.username}
                                />
                              </ListItemButton>
                              <Divider/>
                            </React.Fragment>
                        ))}
                      </List>
                  )}
                </Paper>

                <Paper sx={{flex: 1, p: 2, borderRadius: 2}}>
                  <Typography variant="h6" sx={{mb: 1}}>
                    Vaccinations
                  </Typography>

                  {!selectedUser ? (
                      <Typography variant="body2" color="text.secondary">
                        Select a user to mark vaccinations.
                      </Typography>
                  ) : (
                      <List dense sx={{
                        opacity: selectedUser ? 1 : 0.6,
                        pointerEvents: selectedUser ? "auto" : "none"
                      }}>
                        {vaccinations.map((v) => {
                          const checked = selectedUserVaccinationIds.has(v.id);

                          return (
                              <React.Fragment key={v.id}>
                                <ListItemButton
                                    disabled={isSaving || checked}
                                    onClick={() => openConfirm(v.id, v.name)}
                                >
                                  <Checkbox checked={checked} tabIndex={-1} disableRipple/>
                                  <Tooltip title={v.description} arrow>
                                    <ListItemText primary={v.name}/>
                                  </Tooltip>
                                </ListItemButton>
                                <Divider/>
                              </React.Fragment>
                          );
                        })}
                      </List>
                  )}
                </Paper>
              </Stack>
          )}
        </>
      </AuthGuard>
  );
}
