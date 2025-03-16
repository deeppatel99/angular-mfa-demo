const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let userMFA = {}; // Temporary in-memory store

// Generate QR Code for Microsoft Authenticator
app.post("/generate-qrcode", (req, res) => {
  const { username } = req.body;
  const secret = speakeasy.generateSecret({ name: `MFA-Demo (${username})` });

  userMFA[username] = { secret: secret.base32 }; // Store secret for the user

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.json({ qrcode: data_url, secret: secret.base32 });
  });
});

// Verify OTP from Microsoft Authenticator
app.post("/verify-otp", (req, res) => {
  const { username, token } = req.body;
  const userSecret = userMFA[username]?.secret;

  if (!userSecret) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const verified = speakeasy.totp.verify({
    secret: userSecret,
    encoding: "base32",
    token,
  });

  res.json({ success: verified });
});

app.listen(3000, () => console.log("Server running on port 3000"));
