import cors from 'cors'
import express from 'express'

import mongoose from 'mongoose'
import initializeRoutes from "./routes/index.js";
import {clerkMiddleware} from "@clerk/express";

import path from "path";
import fs from "fs";
import {errorHandler} from "./middleware/error-handler.js";

const initialize = (app) => {
  app.use(clerkMiddleware());
  app.use(cors({
    origin: [process.env.ALLOWED_ORIGINS.split(',')],
    credentials: true
  }));
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb', extended: true}));
  mongoose.connect(process.env.MONGODB_CONNECTION);
  initializeRoutes(app);

  const uploadDir = process.env.UPLOAD_DIR || "./userUploads";
  const uploadPublicUrl = process.env.UPLOAD_PUBLIC_URL || "/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
  }

  app.use(uploadPublicUrl,
      express.static(path.resolve(uploadDir), {maxAge: "1hr", etag: true}));

  app.use(errorHandler);
}

export default initialize;