import Stripe from "stripe";
import Donation from "../models/donation.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await Donation.findOneAndUpdate(
            {stripeCheckoutSessionId: session.id},
            {
              $set: {
                status: "PAID",
                stripePaymentIntentId: session.payment_intent ?? undefined,
                paidAt: new Date(),
              },
            },
            {new: true}
        ).exec();
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        await Donation.findOneAndUpdate(
            {stripeCheckoutSessionId: session.id},
            {$set: {status: "CANCELED"}},
            {new: true}
        ).exec();
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        await Donation.findOneAndUpdate(
            {stripePaymentIntentId: pi.id},
            {$set: {status: "FAILED"}},
            {new: true}
        ).exec();
        break;
      }
      default:
        break;
    }

    res.json({received: true});
  } catch (err) {
    console.error("stripeWebhook handler error:", err);
    res.status(500).send("Webhook handler failed");
  }
};
