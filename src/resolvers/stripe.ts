import dotenv from "dotenv";
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const domain = 'http://localhost:3000/'

const orderPayment = async (reservations: any) => {

    let totalPrice: number = 0
    reservations.forEach((product: any) => {
      totalPrice += product.price;
    });

    const lineItems = [{
        price_data: {
            currency: 'eur',
            product_data: {
                name: "Commande numero " + Math.floor(Math.random() * 100),
            },
            unit_amount: totalPrice * 100,
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