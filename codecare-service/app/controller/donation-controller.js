import {setSuccessResponse} from "../utils/response-handler.js";
import {StatusCodes} from "http-status-codes";
import Stripe from "stripe";
import {getAuth} from "@clerk/express";
import User from "../models/user.js";

export const donate = async (request, response, next) => {
  const successUrl = `${process.env.SSL_URL}:${process.env.UI_PORT}/donate/success`;
  const cancelUrl = `${process.env.SSL_URL}:${process.env.UI_PORT}/donate/cancel`;
  const stripe = new Stripe(process.env.STRIPE_KEY);
  try {
    const auth = getAuth(req);
    let user = null;
    if (auth) {
      const clerkUserId = auth.userId;
      user = await User.findOne({clerkUserId}).exec();
    }
    const amount = request.body.amount;
    let message = "Thank you stranger!";
    if (user) {
      message = "Thank you " + user.firstname + " " + user.lastname + " !";
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Donation",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    setSuccessResponse(StatusCodes.OK, {url: session.url}, response);
  } catch (error) {
    setErrorCode(StatusCodes.INTERNAL_SERVER_ERROR, response);
  }
}