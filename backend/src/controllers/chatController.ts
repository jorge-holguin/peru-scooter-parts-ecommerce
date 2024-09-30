// backend/src/controllers/chatController.ts
import { Request, Response } from 'express';
import openai from '../utils/openaiClient';

// Nueva función independiente para manejar la lógica de OpenAI
export const fetchAIResponse = async (message: string): Promise<string> => {
  try {
    // Realizar la solicitud a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    // Verificar que `choices` no sea nulo y tenga al menos un elemento con `message`
    const aiMessage = completion.choices[0]?.message?.content;

    if (aiMessage) {
      return aiMessage.trim();
    } else {
      return 'Lo siento, no pude generar una respuesta en este momento.';
    }
  } catch (error: any) {
    console.error('Error al obtener respuesta de OpenAI:', error);
    return 'Lo siento, ha ocurrido un error al procesar tu mensaje.';
  }
};

// Controlador para las solicitudes HTTP de Express
export const getAIResponse = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'El mensaje es obligatorio' });
    }

    // Utilizar la función independiente para obtener la respuesta de OpenAI
    const aiResponse = await fetchAIResponse(message);
    res.status(200).json({ response: aiResponse });
  } catch (error: any) {
    console.error('Error al obtener respuesta de OpenAI:', error);
    res.status(500).json({
      message: 'Error al obtener respuesta de la IA',
      error: error.message,
    });
  }
};
