import express from "express"
import * as userController from "../controller/user-controller.js";

const router = express.Router();

router.route('/:id')
    .post(userController.getUser);

export default router;