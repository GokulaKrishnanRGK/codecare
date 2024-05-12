import {Box, Button, Paper, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Link as RouterLink} from "react-router-dom";

export default function Success() {
  const {t} = useTranslation("success");

  return (
      <Box sx={{minHeight: "80vh", display: "grid", placeItems: "center", p: 2}}>
        <Paper sx={{maxWidth: 520, width: "100%", p: 4, borderRadius: 2}}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("success.typo.head")}
          </Typography>

          <Typography variant="body1" sx={{mb: 3}}>
            {t("success.typo.transaction")}
          </Typography>

          <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
            <Button component={RouterLink} to="/" variant="outlined">
              Home
            </Button>
            <Button component={RouterLink} to="/donate" variant="contained">
              Donate again
            </Button>
          </Box>
        </Paper>
      </Box>
  );
}
