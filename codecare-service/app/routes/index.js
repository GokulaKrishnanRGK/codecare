import publicRoute from "./public-route.js";
import auth from "../middleware/auth.js";
import userRoute from "./user-route.js";
import {Roles} from "../entities/roles-enum.js";
import authRoute from "./auth-route.js";

const initializeRoutes = (app) => {
    app.use('/public', publicRoute);
    app.use('/auth', authRoute);
    app.use('/user', auth([Roles.ADMIN]), userRoute);
}

export default initializeRoutes;