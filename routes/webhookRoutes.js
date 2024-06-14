// webhookRoutes.js
const express = require("express");
const { handleWebhook } = require("../controllers/paymentController");

const router = express.Router();

router.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
