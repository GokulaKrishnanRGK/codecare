import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import initialize from "./app/app.js";

dotenv.config();

const app = express();
initialize(app);

const PORT = process.env.PORT || 3000;

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const SSL_URL = process.env.SSL_URL;

if (SSL_KEY_PATH && SSL_CERT_PATH) {
  const key = fs.readFileSync(SSL_KEY_PATH);
  const cert = fs.readFileSync(SSL_CERT_PATH);

  https.createServer({key, cert}, app).listen(PORT, () => {
    console.log(`HTTPS server running at ${SSL_URL}:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });
}
