// backend/src/index.ts
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app';
import { fetchAIResponse } from './controllers/chatController'; // Importar la nueva función

dotenv.config();

const PORT = process.env.PORT || 5000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Configura esto según tus necesidades
  },
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('sendMessage', async (message) => {
    try {
      // Llamar a la función `fetchAIResponse` para obtener la respuesta de la IA
      const aiResponse = await fetchAIResponse(message);

      // Enviar la respuesta al cliente
      socket.emit('receiveMessage', { user: 'bot', message: aiResponse });
    } catch (error) {
      console.error('Error al obtener respuesta de OpenAI:', error);
      socket.emit('receiveMessage', {
        user: 'bot',
        message: 'Lo siento, ha ocurrido un error al procesar tu mensaje.',
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
