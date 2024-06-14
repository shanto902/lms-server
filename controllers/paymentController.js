const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let paymentCollection;

async function setPaymentCollection(client) {
  const paymentDB = client.db("paymentDB");
  paymentCollection = paymentDB.collection("paymentCollection");
}

const createPayment = async (req, res) => {
  const data = req.body;
  try {
    const product = await stripe.products.create({
      name: data?.courseTitle || "DATA",
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: parseInt(data?.price) * 100,
      currency: "usd",
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/create-payment/success",
      cancel_url: "http://localhost:5173/cancel",
      customer_email: data.userEmail,
      metadata: {
        courseId: data.courseId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      const newPayment = {
        sessionId: session.id,
        email: session.customer_email,
        courseTitle: session.metadata.courseTitle,
        price: session.amount_total / 100,
        paymentStatus: session.payment_status,
        createdAt: new Date(),
      };

      try {
        await paymentCollection.insertOne(newPayment);
        console.log("Payment record inserted successfully:", newPayment);
      } catch (err) {
        console.error("Error inserting payment record:", err);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  setPaymentCollection,
  createPayment,
  handleWebhook,
};
