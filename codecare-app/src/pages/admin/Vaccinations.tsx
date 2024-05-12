import {useMemo, useState} from "react";
import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";
import ListToolbar from "../../components/common/ListToolbar";
import ListPagination from "../../components/common/ListPagination";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {InfinitySpin} from "react-loader-spinner";
import {
  useCreateVaccinationMutation,
  useGetVaccinationsQuery,
  useUpdateVaccinationMutation,
} from "../../store/api/adminApi";
import {createVaccinationClientSchema, updateVaccinationClientSchema} from "@codecare/validation";

type FieldErrors = Partial<Record<"name" | "description", string>>;

export default function VaccinationsAdmin(): JSX.Element {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useGetVaccinationsQuery({ page });

  const [createVaccination, { isLoading: isCreating }] = useCreateVaccinationMutation();
  const [updateVaccination, { isLoading: isUpdating }] = useUpdateVaccinationMutation();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const showLoader = isLoading || isFetching;
  const showEmpty = !showLoader && !isError && items.length === 0;

  const isSaving = isCreating || isUpdating;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string>("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditId("");
    setMode("create");
    setFieldErrors({});
  };

  const closeModal = () => {
    if (isSaving) return;
    setOpen(false);
    resetForm();
  };

  const openCreate = () => {
    resetForm();
    setMode("create");
    setOpen(true);
  };

  const openEdit = (v: { id: string; name: string; description: string }) => {
    setMode("edit");
    setEditId(v.id);
    setName(v.name);
    setDescription(v.description);
    setFieldErrors({});
    setOpen(true);
  };

  const validate = (): boolean => {
    const schema = mode === "create" ? createVaccinationClientSchema : updateVaccinationClientSchema;
    const parsed = schema.safeParse({ name, description });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        name: flat.name?.[0],
        description: flat.description?.[0],
      });
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = { name: name.trim(), description: description.trim() };

    if (mode === "create") {
      await createVaccination(payload).unwrap();
      closeModal();
      return;
    }

    await updateVaccination({ id: editId, ...payload }).unwrap();
    closeModal();
  };

  const modalTitle = useMemo(() => (mode === "create" ? "Add vaccination" : "Edit vaccination"), [mode]);

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 520,
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
              title="Vaccinations"
              onRefresh={refetch}
              isRefreshing={showLoader}
              refreshLabel="Refresh vaccinations"
              left={
                <Button variant="contained" onClick={openCreate} disabled={showLoader}>
                  Add vaccination
                </Button>
              }
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={220}>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right" width={120}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {showLoader && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                          <InfinitySpin />
                        </Box>
                      </TableCell>
                    </TableRow>
                )}

                {isError && !showLoader && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Failed to load vaccinations.{" "}
                        <Button onClick={() => refetch()} variant="outlined" size="small">
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                )}

                {showEmpty && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No vaccinations found.
                      </TableCell>
                    </TableRow>
                )}

                {!showLoader &&
                    !isError &&
                    items.map((v) => (
                        <TableRow key={v.id} hover>
                          <TableCell>{v.name}</TableCell>
                          <TableCell sx={{ maxWidth: 720 }}>
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                              {v.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button size="small" variant="outlined" onClick={() => openEdit(v)}>
                              Edit
                            </Button>
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
              caption="Showing 10 vaccinations per page"
          />

          <Modal open={open} onClose={closeModal}>
            <Box sx={modalStyle}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {modalTitle}
              </Typography>

              <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  disabled={isSaving}
                  error={Boolean(fieldErrors.name)}
                  helperText={fieldErrors.name}
              />

              <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  required
                  multiline
                  minRows={4}
                  disabled={isSaving}
                  error={Boolean(fieldErrors.description)}
                  helperText={fieldErrors.description}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                <Button variant="outlined" onClick={closeModal} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving || !name.trim() || !description.trim()}
                >
                  {mode === "create" ? "Save" : "Update"}
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      </AuthGuard>
  );
}
