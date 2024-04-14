import * as authController from "../controller/auth-controller.js";
import router from "./public-route.js";
import auth from "../middleware/auth.js";
import {Roles} from "../entities/roles-enum.js";

router.route('/logout')
    .get(auth([Roles.ADMIN, Roles.DOCTOR, Roles.USER]), authController.logout);

router.route('/test')
    .get(authController.test);

export default router;