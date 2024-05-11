import express from "express";
import * as donationController from "../controller/donation-controller.js";

const router = express.Router();

router.route('/donate')
    .post(donationController.donate);

export default router;