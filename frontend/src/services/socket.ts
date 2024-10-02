import { io } from 'socket.io-client';

// Usar variables de entorno para seleccionar la URL correcta
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
  transports: ['websocket', 'polling'],
});

export default socket;
