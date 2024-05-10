import cors from 'cors'
import express from 'express'

import mongoose from 'mongoose'
import initializeRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";

const initialize = (app) => {
    app.use(cookieParser());
    app.use(cors({
      origin: [process.env.ALLOWED_ORIGINS.split(',')],
      credentials: true
    }));
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: '50mb', extended: true}));
    mongoose.connect(process.env.MONGODB_CONNECTION);
    initializeRoutes(app);
}

export default initialize;