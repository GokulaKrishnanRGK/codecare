import express from "express";
import * as donationController from "../controller/donation-controller.js";

const router = express.Router();

router.post('/checkout', donationController.createCheckoutSession);

router.get("/stats", donationController.getDonationStats);

export default router;