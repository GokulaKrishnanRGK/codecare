import {ResponseObject} from "../../models/ResponseObject";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import TextField from "@mui/material/TextField";
import * as React from "react";
import * as donationService from "../../services/donation-service";
import donateImage from "./../../assets/donate_img1.jpg";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {useMeQuery} from "../../store/api/meApi";
import {useAuth} from "@clerk/clerk-react";
import {skipToken} from "@reduxjs/toolkit/query";

export default function Donate() {
  const {t} = useTranslation("donation");
  const {isSignedIn} = useAuth();
  const {data: user} = useMeQuery(isSignedIn ? undefined : skipToken);

  const userExists = !!user;

  const [amount, setAmount] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const parsedAmount = Number(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isAmountValid) {
      setError(t("donation.validation.amount") || "Please enter a valid amount.");
      return;
    }

    try {
      setIsSubmitting(true);

      const form = new FormData();
      form.set("amount", String(parsedAmount));

      const response: ResponseObject<any> = await donationService.donate(form);

      const url = response?.data?.data?.url; //TODO
      console.log(response);
      if (!url) {
        setError("Failed to start checkout. Please try again.");
        return;
      }
      window.location.href = url;
    } catch (e) {
      console.error(e);
      setError("Failed to start checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Grid
          container
          component="main"
          sx={{
            minHeight: "100vh",
            backgroundImage: `url(${donateImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            px: 2,
          }}
      >
        <CssBaseline/>

        <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{
              m: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              backgroundColor: "rgba(255, 255, 255, 0.97)",
              borderRadius: 2,
              overflow: "hidden",
            }}
        >
          <Box
              sx={{
                width: "100%",
                my: 6,
                mx: 4,
                px: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
          >
            <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
              <HealthAndSafetyOutlinedIcon/>
            </Avatar>

            <Typography component="h1" variant="h5" align="center">
              {t("donation.head")}
            </Typography>

            <Typography variant="body2" sx={{opacity: 0.85}} align="center">
              {userExists
                  ? `${t("donation.typo.name")} : ${user.firstname} ${user.lastname} • ${t(
                      "donation.typo.email"
                  )} : ${user.username}`
                  : "Donating as Anonymous"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{mt: 2, width: "100%"}}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="amount"
                  label={t("donation.textfield.amount")}
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  inputProps={{min: 1, step: "1"}}
                  autoComplete="off"
                  autoFocus
                  disabled={isSubmitting}
                  error={!!error}
                  helperText={error ? error : " "}
              />

              <Box sx={{display: "flex", justifyContent: "center", mt: 1}}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isAmountValid}
                    sx={{minWidth: 160}}
                >
                  {isSubmitting ? <CircularProgress size={22}/> : t("donation.button.donate")}
                </Button>
              </Box>

              <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    display: "block",
                    fontFamily: "Graze, Arial, sans-serif",
                    color: "text.secondary",
                    textAlign: "center",
                  }}
              >
                * {t("donation.typo.caption")}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
}
