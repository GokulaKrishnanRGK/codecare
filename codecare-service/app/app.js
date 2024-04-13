import cors from 'cors'
import express from 'express'

import mongoose from 'mongoose'
import initializeRoutes from "./routes/index.js";

const initialize = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded());
    mongoose.connect(process.env.MONGODB_CONNECTION);
    initializeRoutes(app);
}

export default initialize;