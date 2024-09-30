// src/routes/paymentRoutes.ts
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


router.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  try {
    // Crea un PaymentIntent con el monto y la moneda especificados
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    // Envía el client secret al frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
