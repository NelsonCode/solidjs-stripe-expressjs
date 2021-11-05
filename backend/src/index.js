import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      description: description,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(5000, () => {
  console.log("server on port http://localhost:5000");
});
