import express from "express"
import * as userController from "../controller/user-controller.js";

const router = express.Router();

router.route('/get')
    .get(userController.getUser);

export default router;