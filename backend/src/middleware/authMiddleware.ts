import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Definir el tipo de `AuthRequest` para incluir el usuario autenticado
interface AuthRequest extends Request {
  user?: IUser;
}

// Tipar `protect` como un `RequestHandler`
export const protect: RequestHandler = async (req, res, next) => {
  let token;

  // Verificar el encabezado de autorización para extraer el token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Si no hay token, devolver un error 401
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró el token' });
  }

  try {
    // Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
    }

    // Adjuntar el usuario a la solicitud
    (req as AuthRequest).user = user;

    // Pasar al siguiente middleware
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Token inválido', error: error.message });
  }
};

export const admin: RequestHandler = (req, res, next) => {
    const authReq = req as AuthRequest;
    if (authReq.user && authReq.user.role === 'administrador') {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador' });
    }
  };
