import {useMemo, useState} from "react";
import {useGetDonationsQuery} from "../../store/api/adminApi";
import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import {InfinitySpin} from "react-loader-spinner";
import ListToolbar from "../../components/common/ListToolbar";
import ListPagination from "../../components/common/ListPagination";


type SortBy = "paidAt" | "amount";
type SortDir = "asc" | "desc";

export default function ListDonations() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"ALL" | "PENDING" | "PAID" | "FAILED" | "CANCELED">("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("paidAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const {data, isLoading, isFetching, isError, refetch} = useGetDonationsQuery({
    page,
    status,
    sortBy,
    sortDir,
  });

  const donations = data?.items;
  const totalPages = data?.totalPages ?? 1;
  const totalAmount = data?.totalAmount ?? 0;

  const showLoader = isLoading || isFetching;
  const showEmpty = !showLoader && !isError && donations?.length === 0;

  const toggleSort = (nextSortBy: SortBy) => {
    if (sortBy !== nextSortBy) {
      setSortBy(nextSortBy);
      setSortDir("desc");
      setPage(1);
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const rows = useMemo(() => {
    return (donations ?? []).map((d) => {
      const user = d.user ?? null;

      const username = user?.username ?? "Anonymous";
      const firstname = user?.firstname ?? "Anonymous";
      const lastname = user?.lastname ?? "";

      const ts = d.paidAt;
      const date = ts ? new Date(ts).toLocaleString() : "";

      return {
        id: d.id,
        username,
        firstname,
        lastname,
        amount: d.amount,
        date,
        status: d.status,
      };
    });
  }, [donations]);

  return (
      <AuthGuard allowedRoles={[Roles.ADMIN]}>
        <>
          <ListToolbar
              title="Donations"
              onRefresh={refetch}
              isRefreshing={showLoader}
              refreshLabel="Refresh donations"
              left={
                <FormControl size="small" sx={{minWidth: 180}}>
                  <InputLabel>Status</InputLabel>
                  <Select
                      label="Status"
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value as typeof status);
                        setPage(1);
                      }}
                      disabled={showLoader}
                  >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="CANCELED">Canceled</MenuItem>
                  </Select>
                </FormControl>
              }
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="right">Firstname</TableCell>
                  <TableCell align="right">Lastname</TableCell>

                  <TableCell align="right">
                    <TableSortLabel
                        active={sortBy === "amount"}
                        direction={sortBy === "amount" ? sortDir : "asc"}
                        onClick={() => toggleSort("amount")}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>

                  <TableCell align="center">Status</TableCell>

                  <TableCell align="center">
                    <TableSortLabel
                        active={sortBy === "paidAt"}
                        direction={sortBy === "paidAt" ? sortDir : "asc"}
                        onClick={() => toggleSort("paidAt")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
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
                        Failed to load donations.{" "}
                        <Button onClick={() => refetch()} variant="outlined" size="small">
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                )}

                {showEmpty && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No donations found.
                      </TableCell>
                    </TableRow>
                )}

                {!showLoader &&
                    !isError &&
                    rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row.username}</TableCell>
                          <TableCell align="right">{row.firstname}</TableCell>
                          <TableCell align="right">{row.lastname}</TableCell>
                          <TableCell align="right">{row.amount}</TableCell>
                          <TableCell align="center">{row.status}</TableCell>
                          <TableCell align="center">{row.date}</TableCell>
                        </TableRow>
                    ))}

                {!showLoader && !isError && !showEmpty && (
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{fontWeight: 700}}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{fontWeight: 700}}>
                        {totalAmount}
                      </TableCell>
                      <TableCell colSpan={2}/>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <ListPagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              disabled={showLoader}
              caption="Showing 10 donations per page"
          />
        </>
      </AuthGuard>
  );
}
