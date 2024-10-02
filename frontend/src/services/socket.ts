import { io } from 'socket.io-client';

// Usar variables de entorno para seleccionar la URL correcta
const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ['websocket', 'polling'],
});

export default socket;
