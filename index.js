require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { setCourseCollection } = require("./controllers/courseController");
const { setUserCollection } = require("./controllers/userController");
const { setPaymentCollection } = require("./controllers/paymentController");
const webhookRoutes = require("./routes/webhookRoutes");
const app = express();
const port = process.env.PORT;

app.use(cors());

connectDB()
  .then((client) => {
    setCourseCollection(client);
    setUserCollection(client);
    setPaymentCollection(client);

    app.use("/webhooks", webhookRoutes);

    app.use(express.json());
    app.use("/api", courseRoutes);
    app.use("/api", userRoutes);
    app.use("/api", paymentRoutes);

    app.get("/", (req, res) => {
      res.send("API is working");
    });

    app.listen(port, () => {
      console.log("App is listening on port :", port);
    });
  })
  .catch(console.error);
