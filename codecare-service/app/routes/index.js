import adminRoute from "./admin-route.js";
import eventRoute from "./event-route.js";
import donationRoute from "./donation-route.js";
import meRoute from "./me-route.js";
import volunteerRoute from "./volunteer-route.js";

const initializeRoutes = (app) => {
  app.use("/api/me", meRoute);
  app.use('/api/admin', adminRoute);
  app.use('/api/events', eventRoute);
  app.use('/api/donations', donationRoute);
  app.use("/api/volunteer", volunteerRoute);
}

export default initializeRoutes;