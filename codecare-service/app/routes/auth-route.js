import express from "express"
import * as authController from "../controller/auth-controller.js";

const router = express.Router();

router.route('/login')
    .post(authController.login);

router.route('/register')
    .post(authController.register);

export default router;