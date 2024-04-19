import publicRoute from "./public-route.js";
import auth from "../middleware/auth.js";
import userRoute from "./user-route.js";
import eventRoute from "./event-route.js";
import {Roles} from "../entities/roles-enum.js";
import authRoute from "./auth-route.js";
import profileRoute from "./profile-route.js";
import medicalDiagnosisRoute from "./medical-diagnosis-route.js"
import donationRoute from "./donation-route.js";
import apponitmentBookingRoute from './appointment-booking-route.js';
import doctorRoute from "./doctor-route.js";


const initializeRoutes = (app) => {
    app.use('/api/public', publicRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/user', auth([Roles.ADMIN]), userRoute);
    app.use('/api/events', eventRoute);
    app.use('/api/profiles',profileRoute);
    app.use('/api/profiles/medical-diagnoses',medicalDiagnosisRoute);
    app.use('/api/donations', donationRoute);
    app.use('/api/appointment-bookings',apponitmentBookingRoute);
    app.use('/api/doctor',doctorRoute);
}

export default initializeRoutes;