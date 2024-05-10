import {Box} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

import MainFeaturedPost from "../components/Homepage/MainFeaturedPost";
import Footer from "../components/Homepage/Footer";
import MyButton from "../utils/MyButton";

import booking_appointment from "./../assets/booking_appointment.jpg";
import donations from "./../assets/donations.jpg";

import {Status} from "../constants/eventStatus-enum.ts";
import {useGetEventsQuery} from "../store/api/eventsApi";
import {useMemo} from "react";

export default function HomePage(): JSX.Element {
  const {t} = useTranslation("common");
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetEventsQuery({
    eventStatus: Status.UPCOMING,
    page: 1,
  });

  const events = data?.items ?? [];

  const sliderSettings: Slider["props"] = useMemo(() => {
    const count = events.length;

    const isLoopEnabled = count > 1;

    return {
      dots: isLoopEnabled,
      infinite: isLoopEnabled,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: isLoopEnabled,
      swipe: isLoopEnabled,
      draggable: isLoopEnabled,
      adaptiveHeight: true,
    };
  }, [events.length]);

  const showLoader = isLoading || isFetching;

  return (
      <main>
        <MainFeaturedPost/>

        <Box sx={{position: "relative", zIndex: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"}}>
          <Typography variant="h4" component="h2" sx={{my: 2, textAlign: "center"}}>
            Upcoming Events
          </Typography>

          {showLoader && (
              <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
                <Typography variant="body1" color="text.secondary">
                  Loading events…
                </Typography>
              </Box>
          )}

          {isError && (
              <Box sx={{px: 2, pb: 2}}>
                <Alert
                    severity="error"
                    action={
                      <Button color="inherit" size="small" onClick={() => refetch()}>
                        Retry
                      </Button>
                    }
                >
                  Failed to load events.
                </Alert>
              </Box>
          )}

          {!showLoader && !isError && events.length === 0 && (
              <Box sx={{px: 2, pb: 3, textAlign: "center"}}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming events right now.
                </Typography>
              </Box>
          )}

          {!showLoader && !isError && events.length > 0 && (
              <Slider {...sliderSettings}>
                {events.map((event) => (
                    <Box key={event.id} sx={{display: "flex", p: 2, minHeight: 300}}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <img
                              src={event.eventImage || "/images/pwa-512x512.png"}
                              alt={event.title ? `Flyer for ${event.title}` : "Event flyer"}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "100%",
                                maxHeight: 300,
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                          />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              gap: 0.5
                            }}
                        >
                          <Typography variant="h5">{event.title}</Typography>

                          <Typography variant="subtitle1">
                            <b>{t("homepage.link.label.homepageFeaturedHost")}:</b> {event.organizer}
                          </Typography>

                          <Typography variant="body1">
                            <b>{t("homepage.link.label.homepageFeaturedDate")}:</b>{" "}
                            {new Date(event.date).toLocaleDateString()}
                          </Typography>

                          <Typography variant="body1">
                            <b>{t("homepage.link.label.homepageFeaturedLocation")}:</b>{" "}
                            {`${event.location.name}, ${event.location.address}, ${event.location.city}, ${event.location.state}, ${event.location.country}`}
                          </Typography>

                          <Box sx={{display: "flex", justifyContent: "flex-end", mt: 2}}>
                            <MyButton
                                label={t("homepage.link.label.homepageFeaturedMoreDetails")}
                                variant="contained"
                                onClick={() => navigate(`/events/${event.id}`)}
                                sx={{fontSize: "0.75rem", padding: "6px 12px"}}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                ))}
              </Slider>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
                sx={{
                  maxWidth: "1200px",
                  height: "500px",
                  margin: "20px auto",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: {xs: "column", md: "row"}, // ✅ responsive
                  gap: 2,
                }}
            >
              <Box sx={{flex: 1, px: 2}}>
                <Typography component="h2" variant="h4" align="left" noWrap>
                  {t("homepage.link.label.homepageAppointmentTitle")} !!!
                </Typography>

                <Typography component="p" variant="body1" align="left">
                  {t("homepage.link.label.homepageAppointmentDetails")}
                </Typography>
              </Box>

              <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                    backgroundImage: `url(${booking_appointment})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left center",
                    height: {xs: 240, md: "100%"},
                    borderRadius: "8px",
                  }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
                sx={{
                  maxWidth: "1200px",
                  height: "500px",
                  margin: "20px auto",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: {xs: "column", md: "row"}, // ✅ responsive
                  gap: 2,
                }}
            >
              <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                    backgroundImage: `url(${donations})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right center",
                    height: {xs: 240, md: "100%"},
                    borderRadius: "8px",
                  }}
              />

              <Box sx={{flex: 1, px: 2}}>
                <Typography component="h2" variant="h4" align="left" noWrap>
                  {t("homepage.link.label.homepageDonationsTitle")}
                </Typography>

                <Typography component="p" variant="body1" align="left">
                  {t("homepage.link.label.homepageDonationDetails")}
                </Typography>

                <Box sx={{mt: 2}}>
                  <MyButton
                      label={t("header.button.label.donate")}
                      variant="contained"
                      onClick={() => navigate("/donate")}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{mt: 6}}>
          <Footer
              title="CodeCare"
              description="Empowering communities through accessible healthcare solutions."
          />
        </Box>
      </main>
  );
}
