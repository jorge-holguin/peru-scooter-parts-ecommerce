import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Definir el tipo de `AuthRequest` para incluir el usuario autenticado
interface AuthRequest extends Request {
  user?: IUser;
}

// Middleware de protección para validar el token JWT
export const protect: RequestHandler = async (req, res, next) => {
  let token;

  // Verificar el encabezado de autorización para extraer el token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log(`Token recibido en la cabecera de autorización: ${token}`);
  } else {
    console.warn('No se encontró la cabecera de autorización o el formato es incorrecto.');
    console.warn('Cabeceras de la solicitud:', JSON.stringify(req.headers, null, 2));
  }

  // Si no hay token, devolver un error 401
  if (!token) {
    console.warn('No autorizado: No se encontró el token en la cabecera de autorización.');
    return res.status(401).json({ message: 'No autorizado, no se encontró el token' });
  }

  try {
    // Verificar que `JWT_SECRET` esté presente
    if (!process.env.JWT_SECRET) {
      console.error('Falta la variable de entorno JWT_SECRET. Asegúrate de definirla.');
      return res.status(500).json({ message: 'Error en el servidor: Falta JWT_SECRET' });
    }

    console.log(`JWT_SECRET usado para verificar el token: ${process.env.JWT_SECRET}`);

    // Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    console.log('Token decodificado con éxito:', decoded);

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn(`No se encontró el usuario con ID: ${decoded.id}`);
      return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
    }

    console.log(`Usuario autenticado: ${user.name} (${user.email})`);

    // Adjuntar el usuario a la solicitud
    (req as AuthRequest).user = user;

    // Pasar al siguiente middleware
    next();
  } catch (error: any) {
    console.error('Error al verificar el token JWT:', error.message);
    res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
  }
};

// Middleware para verificar si el usuario tiene rol de administrador
export const admin: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;
  if (authReq.user && authReq.user.role === 'administrador') {
    console.log(`Acceso de administrador concedido a: ${authReq.user.name}`);
    next();
  } else {
    console.warn('Acceso denegado: El usuario no tiene permisos de administrador.');
    res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador' });
  }
};
