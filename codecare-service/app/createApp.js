import express from "express";
import initialize from "./app.js";

export function createApp() {
  const app = express();
  initialize(app);
  return app;
}
