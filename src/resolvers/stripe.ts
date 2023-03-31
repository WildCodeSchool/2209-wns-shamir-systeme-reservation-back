import dotenv from "dotenv";
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const domain = 'http://localhost:3000/'

const orderPayment = async (products: any) => {
    let email = products.at(-1)

    const listProduct = products.slice(0, products.length - 1);
    const lineItems = listProduct.map((product: any) => ({
        price_data: {
            currency: 'eur',
            product_data: {
                name: product.name,
            },
            unit_amount: product.price * 100,
        },
        quantity: 1,
    }));
    
    const session = await stripe.checkout.sessions.create({
        // customer_email: email,
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