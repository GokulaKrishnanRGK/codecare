import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid, InputAdornment,
  InputLabel,
  MenuItem, Paper,
  Select,
  type SelectChangeEvent,
  Snackbar, TextField,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import {InfinitySpin} from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import EventTile from "../../components/Event/EventTile";
import Roles from "../../models/auth/Roles";
import * as authUtil from "../../utils/auth-util";
import {getUser} from "../../store/loginUser-slice";

import {Status} from "../../constants/eventStatus-enum";

import type {
  EventSearchParams,
  EventStatusFilter,
} from "../../models/events/EventDto";

import {useDeleteEventMutation, useGetEventsQuery} from "../../store/api/eventsApi";

type SnackState = {
  open: boolean;
  severity: "success" | "error";
  message: string;
};

function toErrorMessage(err: unknown): string {
  if (!err) return "Something went wrong.";
  if (typeof err === "string") return err;

  const maybeObj = err as { status?: number; data?: any; error?: string };
  if (maybeObj?.data?.error?.message) return String(maybeObj.data.error.message);
  if (maybeObj?.data?.message) return String(maybeObj.data.message);
  if (maybeObj?.error) return String(maybeObj.error);
  return "Failed to load events.";
}

export default function Events(): JSX.Element {
  const navigate = useNavigate();
  const {t} = useTranslation("events");
  const user = useSelector(getUser());

  const canAdmin = useMemo(() => authUtil.isUserInRole(user, [Roles.ADMIN]), [user]);

  const [searchParams, setSearchParams] = useState<Omit<EventSearchParams, "page">>({
    keyword: "",
    eventStatus: Status.ALL as EventStatusFilter,
  });

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [searchParams.keyword, searchParams.eventStatus]);

  const queryArgs: EventSearchParams = useMemo(
      () => ({
        ...searchParams,
        keyword: searchParams.keyword?.trim() ? searchParams.keyword.trim() : undefined,
        page,
      }),
      [searchParams, page]
  );

  const {data, error, isLoading, isFetching, isError, refetch} =
      useGetEventsQuery(queryArgs);

  const events = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const [deleteEvent, {isLoading: isDeleting}] = useDeleteEventMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const [snack, setSnack] = useState<SnackState>({
    open: false,
    severity: "success",
    message: "",
  });

  const closeSnack = (): void => setSnack((prev) => ({...prev, open: false}));

  const openDeleteDialog = (id: string): void => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = (): void => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
    setDeleteId("");
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteId) return;

    try {
      await deleteEvent(deleteId).unwrap();
      setSnack({open: true, severity: "success", message: "Event deleted"});
      closeDeleteDialog();

      if (events.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch {
      setSnack({open: true, severity: "error", message: "Delete failed"});
    }
  };

  const handleStatusChange = (e: SelectChangeEvent): void => {
    const next = e.target.value as EventStatusFilter;
    setSearchParams((prev) => ({
      ...prev,
      eventStatus: next,
    }));
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchParams((prev) => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const showLoader = isLoading || isFetching;
  const showEmpty = !showLoader && !isError && events.length === 0;

  return (
      <>
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

        <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this event?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} disabled={isDeleting}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <main>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <TextField
                size="small"
                placeholder={t("filter.search")}
                value={searchParams.keyword ?? ""}
                onChange={handleKeywordChange}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                  ),
                }}
            />

            <FormControl size="small" sx={{width: 160}}>
              <InputLabel>{t("filter.status")}</InputLabel>
              <Select
                  id="eventStatus"
                  label={t("filter.status")}
                  value={searchParams.eventStatus ?? (Status.ALL as EventStatusFilter)}
                  onChange={handleStatusChange}
              >
                <MenuItem value={Status.ALL}>{t("filter.status.all")}</MenuItem>
                <MenuItem value={Status.UPCOMING}>{t("filter.status.upcoming")}</MenuItem>
                <MenuItem value={Status.COMPLETE}>{t("filter.status.past")}</MenuItem>
              </Select>
            </FormControl>

            {canAdmin && (
                <CardActions sx={{p: 0}}>
                  <Button size="small" variant="contained"
                          onClick={() => navigate("/events/create")}>
                    Create
                  </Button>
                </CardActions>
            )}
          </Box>

          {showLoader && (
              <Box className="eventImageContainer" sx={{mt: 2}}>
                <InfinitySpin/>
              </Box>
          )}

          {isError && (
              <Box sx={{mt: 2}}>
                <Alert
                    severity="error"
                    action={
                      <Button color="inherit" size="small" onClick={() => refetch()}>
                        Retry
                      </Button>
                    }
                >
                  {toErrorMessage(error)}
                </Alert>
              </Box>
          )}

          {showEmpty && (
              <Box sx={{mt: 3}}>
                <Typography variant="h6">No events found.</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or status filter.
                </Typography>
              </Box>
          )}

          {!showLoader && !isError && events.length > 0 && (
              <>
                <Grid container spacing={4} sx={{mt: 1}}>
                  {events.map((event) => (
                      <Grid item xs={12} md={6} key={event.id}>
                        <Paper sx={{ p: 2 }}>
                          <EventTile
                              event={event}
                              onOpen={(id) => navigate(`/events/${id}`)}
                              onRequestDelete={(id) => openDeleteDialog(id)}
                          />
                        </Paper>
                      </Grid>
                  ))}
                </Grid>

                <Box sx={{mt: 3, display: "flex", justifyContent: "center"}}>
                  <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_e, value) => setPage(value)}
                      color="primary"
                      showFirstButton
                      showLastButton
                      disabled={showLoader}
                  />
                </Box>

                <Box sx={{mt: 1, textAlign: "center"}}>
                  <Typography variant="caption" color="text.secondary">
                    Showing 5 events per page
                  </Typography>
                </Box>
              </>
          )}
        </main>
      </>
  );
}
