const express = require("express");
const { handleWebhook } = require("../controllers/paymentController");

const router = express.Router();

// Use raw body parser middleware for this route
router.post("/", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
