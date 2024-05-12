import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import initializeRoutes from "./routes/index.js";
import {clerkMiddleware} from "@clerk/express";
import path from "path";
import fs from "fs";
import {errorHandler} from "./middleware/error-handler.js";
import {stripeWebhook} from "./controller/stripe-webhook-controller.js";

const initialize = (app) => {
  if (process.env.NODE_ENV === "test") {
    app.use((req, _res, next) => {
      const clerkUserId = req.header("x-test-clerk-user-id");
      const userDbId = req.header("x-test-user-id");

      if (clerkUserId) {
        req.__testClerkUserId = clerkUserId;
      }
      if (userDbId) {
        req.user = {_id: userDbId};
      }

      next();
    });
  }
  app.use(clerkMiddleware());

  app.post("/api/stripe/webhook", express.raw({type: "application/json"}),
      stripeWebhook);

  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

  app.use(
      cors({
        origin: allowedOrigins.length ? allowedOrigins : true,
        credentials: true,
      })
  );

  app.use(express.json({limit: "50mb"}));
  app.use(express.urlencoded({limit: "50mb", extended: true}));

  if (process.env.NODE_ENV !== "test") {
    mongoose.connect(process.env.MONGODB_CONNECTION);
  }

  initializeRoutes(app);

  const uploadDir = process.env.UPLOAD_DIR || "./userUploads";
  const uploadPublicUrl = process.env.UPLOAD_PUBLIC_URL || "/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
  }

  app.use(uploadPublicUrl,
      express.static(path.resolve(uploadDir), {maxAge: "1hr", etag: true}));

  app.use(errorHandler);
};

export default initialize;
