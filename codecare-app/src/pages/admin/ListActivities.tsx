import {useMemo, useState} from "react";
import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {InfinitySpin} from "react-loader-spinner";
import ListToolbar from "../../components/common/ListToolbar";
import ListPagination from "../../components/common/ListPagination";
import {useGetActivitiesQuery} from "../../store/api/adminApi.ts";


export default function ListActivities() {
  const [page, setPage] = useState(1);

  const {data, isLoading, isFetching, isError, refetch} = useGetActivitiesQuery({
    page
  });

  const activities = data?.items;
  const totalPages = data?.totalPages ?? 1;

  const showLoader = isLoading || isFetching;
  const showEmpty = !showLoader && !isError && activities?.length === 0;

  const rows = useMemo(() => {
    return (activities ?? []).map((d) => {
      const username = d?.user?.username ?? "Anonymous";
      const ts = d.date;
      const date = ts ? new Date(ts).toLocaleString() : "";

      return {
        id: d.id,
        username,
        endpoint: d.endpoint,
        method: d.method,
        date,
        status: d.status,
      };
    });
  }, [activities]);

  return (
      <AuthGuard allowedRoles={[Roles.ADMIN]}>
        <>
          <ListToolbar
              title="Activities"
              onRefresh={refetch}
              isRefreshing={showLoader}
              refreshLabel="Refresh activities"
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="right">Endpoint</TableCell>
                  <TableCell align="right">Method</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {showLoader && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
                          <InfinitySpin/>
                        </Box>
                      </TableCell>
                    </TableRow>
                )}

                {isError && !showLoader && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Failed to load activities.{" "}
                        <Button onClick={() => refetch()} variant="outlined" size="small">
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                )}

                {showEmpty && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No activities found.
                      </TableCell>
                    </TableRow>
                )}

                {!showLoader &&
                    !isError &&
                    rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row.username}</TableCell>
                          <TableCell align="center">{row.endpoint}</TableCell>
                          <TableCell align="center">{row.method}</TableCell>
                          <TableCell align="center">{row.status}</TableCell>
                          <TableCell align="center">{row.date}</TableCell>
                        </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ListPagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              disabled={showLoader}
              caption="Showing 10 activities per page"
          />
        </>
      </AuthGuard>
  );
}
