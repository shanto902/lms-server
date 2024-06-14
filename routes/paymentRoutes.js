const express = require("express");
const { createPayment } = require("../controllers/paymentController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPayment);

module.exports = router;
