import authRoute from "./auth-route.js";
import auth from "../middleware/auth.js";
import userRoute from "./user-route.js";

const initializeRoutes = (app) => {
    app.use('/auth', authRoute);
    app.use('/user', auth, userRoute);
}

export default initializeRoutes;