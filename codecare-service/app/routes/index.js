import authRoute from "./auth-route.js";
import auth from "../middleware/auth.js";
import userRoute from "./user-route.js";
import {Roles} from "../entities/roles-enum.js";

const initializeRoutes = (app) => {
    app.use('/auth', authRoute);
    app.use('/user', auth([Roles.ADMIN]), userRoute);
}

export default initializeRoutes;