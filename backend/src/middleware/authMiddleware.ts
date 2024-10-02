import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect: RequestHandler = async (req, res, next) => {
  let token;

  // Verificar el encabezado de autorización para extraer el token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Si no hay token, devolver un error 401
  if (!token) {
    console.warn('No autorizado: No se encontró el token en la cabecera.');
    console.warn('Cabeceras de la solicitud:', req.headers); // Log para ver las cabeceras recibidas
    return res.status(401).json({ message: 'No autorizado, no se encontró el token' });
  }

  console.log('Token recibido en la cabecera:', token);

  try {
    // Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
    console.log('Token decodificado correctamente:', decoded);

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn('Usuario no encontrado para el ID decodificado.');
      return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
    }

    console.log(`Usuario encontrado en la base de datos: ${user.name} (${user.email})`);

    // Adjuntar el usuario a la solicitud
    (req as AuthRequest).user = user;

    // Pasar al siguiente middleware
    next();
  } catch (error: any) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
  }
};
