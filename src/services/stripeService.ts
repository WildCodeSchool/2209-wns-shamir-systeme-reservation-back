import dotenv from "dotenv";
import Order from "../models/Order";
import PaymentSheetType from "../inputs/PaymentSheetType";
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const domain = "http://localhost:3000/";

const orderPayment = async (order: Order) => {
  const lineItems = [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: "Commande numero " + order.id,
        },
        unit_amount: order.total_price * 100,
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: domain + "commande/valide",
    cancel_url: domain + "commande/refuse",
  });

  return session.url;
};

const paymentSheetMobile = async (totalAmount: number) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "eur",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const paymentSheet: PaymentSheetType = {
    paymentIntentId: paymentIntent.client_secret,
    ephemeralKeySecret: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51Mqu3gFDBdJluanMYizpCQpQou4wgTEQN4B5A0LR72Z7r9i6L0jHRM8mBtbnj6BH2tYwE7ftbSuTTn7VRNw4NLUm00F23lfII0",
  };

  return paymentSheet;
};

export default {
  orderPayment,
  paymentSheetMobile,
};
