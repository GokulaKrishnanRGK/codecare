import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import HealthCareImage from "./../../assets/home.webp";
import { useTranslation } from "react-i18next";

export default function MainFeaturedPost() {
  const { t } = useTranslation("common");

  return (
      <Paper
          sx={{
            p: { xs: 3, md: 6 },
            mb: 4,
            backgroundColor: "#fff",
          }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                  component="h1"
                  variant="h3"
                  gutterBottom
                  sx={{ color: "#000" }}
              >
                {t("homepage.link.label.homepageTitle")}
              </Typography>

              <Typography
                  variant="h5"
                  paragraph
                  sx={{ color: "#000" }}
              >
                {t("homepage.link.label.homepageDescription")}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
                component="img"
                src={HealthCareImage}
                alt="Healthcare"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                }}
            />
          </Grid>
        </Grid>
      </Paper>
  );
}
