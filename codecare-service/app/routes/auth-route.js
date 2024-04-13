import express from "express"
import * as authController from "../controller/auth-controller.js";

const router = express.Router();

router.route('/login')
    .post(authController.login);

export default router;