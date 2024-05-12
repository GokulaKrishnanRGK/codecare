import {useNavigate} from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";

export default function Forbidden(): JSX.Element {
  const navigate = useNavigate();

  return (
      <Box sx={{minHeight: "80vh", display: "grid", placeItems: "center", p: 2}}>
        <Paper
            elevation={6}
            sx={{
              maxWidth: 560,
              width: "100%",
              p: 4,
              borderRadius: 2,
            }}
        >
          <Stack spacing={2}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <BlockIcon color="error"/>
              <Typography variant="h5" component="h1">
                Access forbidden
              </Typography>
            </Box>

            <Typography variant="body1" sx={{opacity: 0.85}}>
              You’re signed in, but your account doesn’t have permission to view this page.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              If you believe this is a mistake, contact an admin or try signing in with a different
              account.
            </Typography>

            <Box sx={{display: "flex", justifyContent: "flex-end", gap: 1, mt: 1}}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Go back
              </Button>
              <Button variant="contained" onClick={() => navigate("/")}>
                Home
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
  );
}
