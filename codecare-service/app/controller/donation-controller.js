import Stripe from "stripe";
import {StatusCodes} from "http-status-codes";
import {
  setErrorResponseMsg,
  setSuccessResponse
} from "../utils/response-handler.js";
import * as donationService from "../services/donation-service.js";
import {getCurrentUserFromClerk} from "../utils/auth-user.js";


export const createCheckoutSession = async (req, res) => {
  const successUrl = `${process.env.SSL_URL}:${process.env.UI_PORT}/donate/success`;
  const cancelUrl = `${process.env.SSL_URL}:${process.env.UI_PORT}/donate/cancel`;

  try {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return setErrorResponseMsg("Invalid amount", res,
          StatusCodes.BAD_REQUEST);
    }

    let user = await getCurrentUserFromClerk(req);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {name: "Donation"},
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,

      client_reference_id: user ? String(user._id) : undefined,
      metadata: {
        appUserId: user ? String(user._id) : "",
        clerkUserId: user ? user.clerkUserId : "",
        donationAmount: String(amount),
      },
    });

    await donationService.createDonation({
      user: user ? (user._id ?? user.id) : undefined,
      amount,
      currency: "usd",
      stripeCheckoutSessionId: session.id,
      status: "PENDING",
    })

    setSuccessResponse(StatusCodes.OK, {url: session.url}, res);
  } catch (error) {
    setErrorResponseMsg(error, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await donationService.sumDonationsAmount(
        {status: "PAID"});
    setSuccessResponse(StatusCodes.OK, {totalDonations}, res);
  } catch (err) {
    setErrorResponseMsg(err, res, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
