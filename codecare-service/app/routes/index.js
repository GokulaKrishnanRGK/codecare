import publicRoute from "./public-route.js";
import auth from "../middleware/auth.js";
import userRoute from "./user-route.js";
import eventRoute from "./event-route.js";
import {Roles} from "../entities/roles-enum.js";
import authRoute from "./auth-route.js";

const initializeRoutes = (app) => {
    app.use('/api/public', publicRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/user', auth([Roles.ADMIN]), userRoute);
    app.use('/api/events', eventRoute);
}

export default initializeRoutes;