import {useMemo, useState} from "react";
import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type {User} from "../../models/auth/User";
import {useGetUsersQuery, useUpdateUserRoleMutation} from "../../store/api/adminApi";
import {InfinitySpin} from "react-loader-spinner";
import ListToolbar from "../../components/common/ListToolbar";
import ListPagination from "../../components/common/ListPagination";

export default function ListUsers() {
  const [page, setPage] = useState(1);

  const {data, isLoading, isFetching, isError, refetch} = useGetUsersQuery({page});
  const [updateRole, {isLoading: isSaving}] = useUpdateUserRoleMutation();

  const users = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"USER" | "ADMIN" | "VOLUNTEER">("USER");

  const showLoader = isLoading || isFetching;

  const openEditModal = (user: User) => {
    setEditedUser(user);
    setRole(user.role);
    setOpen(true);
  };

  const closeEditModal = () => {
    setOpen(false);
    setEditedUser(null);
  };

  const isTargetAdmin = useMemo(() => editedUser?.role === Roles.ADMIN, [editedUser]);

  const handleSave = async () => {
    if (!editedUser) return;
    await updateRole({userId: editedUser.id, role}).unwrap();
    closeEditModal();
  };

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
      <AuthGuard allowedRoles={[Roles.ADMIN]}>
        <>
          <ListToolbar
              title="Users"
              onRefresh={refetch}
              isRefreshing={showLoader}
              refreshLabel="Refresh users"
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="right">Firstname</TableCell>
                  <TableCell align="right">Lastname</TableCell>
                  <TableCell align="right">Role</TableCell>
                  <TableCell align="center">Edit</TableCell>
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
                      <TableCell colSpan={5} align="center">
                        Failed to load users.{" "}
                        <Button onClick={() => refetch()} variant="outlined" size="small">
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                )}

                {!showLoader &&
                    !isError &&
                    users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell align="center">{user.username}</TableCell>
                          <TableCell align="right">{user.firstname}</TableCell>
                          <TableCell align="right">{user.lastname}</TableCell>
                          <TableCell align="right">{user.role}</TableCell>
                          <TableCell align="center">
                            {user.role === Roles.ADMIN ? (
                                <Button variant="outlined" disabled>
                                  Edit
                                </Button>
                            ) : (
                                <Button variant="outlined" onClick={() => openEditModal(user)}>
                                  Edit
                                </Button>
                            )}
                          </TableCell>
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
              caption="Showing 10 users per page"
          />

          <Modal open={open} onClose={closeEditModal}>
            <Box sx={style}>
              <Typography variant="h6" sx={{mb: 2}}>
                Edit User
              </Typography>

              <Typography variant="body2" sx={{mb: 2, opacity: 0.8}}>
                {editedUser?.username}
              </Typography>

              <FormControl fullWidth sx={{mb: 2}}>
                <InputLabel>Role</InputLabel>
                <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value as "USER" | "ADMIN" | "VOLUNTEER")}
                    disabled={isTargetAdmin}
                >
                  <MenuItem value={Roles.USER}>User</MenuItem>
                  <MenuItem value={Roles.VOLUNTEER}>Volunteer</MenuItem>
                  <MenuItem value={Roles.ADMIN}>Admin</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
                <Button onClick={closeEditModal} variant="outlined" disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!editedUser || isSaving || isTargetAdmin || editedUser.role === role}
                >
                  Save Changes
                </Button>
              </Box>

              {isTargetAdmin && (
                  <Typography variant="caption" sx={{display: "block", mt: 2, opacity: 0.75}}>
                    Admin roles cannot be changed.
                  </Typography>
              )}
            </Box>
          </Modal>
        </>
      </AuthGuard>
  );
}
