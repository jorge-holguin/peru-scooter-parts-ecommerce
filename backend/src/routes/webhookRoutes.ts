// src/routes/webhookRoutes.ts
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe requiere el cuerpo sin procesar para validar la firma del webhook
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (request: Request, response: Response) => {
    const sig = request.headers['stripe-signature']!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error(`Error al verificar la firma del webhook.`);
      return response.sendStatus(400);
    }

    // Manejar el evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`¡PaymentIntent para ${paymentIntent.amount} fue exitoso!`);
        // TODO: Manejar el pago exitoso aquí (por ejemplo, actualizar orden en la base de datos)
        break;
      // ... manejar otros tipos de eventos si es necesario
      default:
        console.log(`Evento no manejado tipo ${event.type}`);
    }

    // Retornar una respuesta 200 para reconocer recepción del evento
    response.send();
  }
);

export default router;
