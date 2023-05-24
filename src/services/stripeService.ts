import dotenv from "dotenv";
import Order from "../models/Order";
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const domain = 'http://localhost:3000/'

const orderPayment = async (order: Order) => {

    const lineItems = [{
        price_data: {
            currency: 'eur',
            product_data: {
                name: "Commande numero " + order.id,
            },
            unit_amount: order.total_price * 100,
        },
        quantity: 1
    }];
    
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: domain + "commande/valide",
        cancel_url: domain + "commande/refuse",
    });

    return session.url
}

export default {
    orderPayment
}