import {useNavigate} from "react-router-dom";
import {Box, Button, Paper, Stack, Typography} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NotFound(): JSX.Element {
  const navigate = useNavigate();

  return (
      <Box sx={{minHeight: "80vh", display: "grid", placeItems: "center", p: 2}}>
        <Paper sx={{maxWidth: 560, width: "100%", p: 4, borderRadius: 2}} elevation={6}>
          <Stack spacing={2}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <SearchOffIcon color="action"/>
              <Typography variant="h5" component="h1">
                Page not found
              </Typography>
            </Box>

            <Typography variant="body1" sx={{opacity: 0.85}}>
              The page you’re looking for doesn’t exist, or the link is outdated.
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
