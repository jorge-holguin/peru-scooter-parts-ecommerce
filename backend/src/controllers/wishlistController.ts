// backend/src/controllers/wishlistController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// Agregar un producto a la lista de deseos
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Revisar el cuerpo de la solicitud y el token recibido
    console.log('Solicitud recibida para agregar a wishlist: ', req.body);
    console.log('Usuario autenticado: ', req.user);
    
    if (!productId) {
      console.error('Error: Falta el ID del producto en la solicitud');
      return res.status(400).json({ message: 'Falta el ID del producto en la solicitud' });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error(`Error: Usuario con ID ${userId} no encontrado`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asegurarse de que wishlist es un array
    user.wishlist = user.wishlist || [];

    // Verificar si el producto ya está en la lista de deseos
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      console.log('Producto agregado a la lista de deseos con éxito');
      res.status(200).json({ message: 'Producto agregado a la lista de deseos' });
    } else {
      console.log('El producto ya está en la lista de deseos');
      res.status(400).json({ message: 'El producto ya está en la lista de deseos' });
    }
  } catch (error) {
    console.error('Error al agregar a la lista de deseos: ', error);
    res.status(500).json({
      message: 'Error al agregar a la lista de deseos',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Obtener la lista de deseos del usuario
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');

    if (!user) {
      console.error(`Usuario con ID ${req.user.id} no encontrado`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Error al obtener la lista de deseos: ', error);
    res.status(500).json({
      message: 'Error al obtener la lista de deseos',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Eliminar un producto de la lista de deseos
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    console.log(`Solicitud para remover el producto con ID ${productId} de la lista de deseos del usuario ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      console.error(`Usuario con ID ${userId} no encontrado`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asegurarse de que wishlist es un array
    user.wishlist = user.wishlist || [];

    const initialWishlistLength = user.wishlist.length;

    user.wishlist = user.wishlist.filter(
      (id: any) => id.toString() !== productId
    );

    if (user.wishlist.length === initialWishlistLength) {
      console.error('El producto no estaba en la lista de deseos');
      return res.status(400).json({ message: 'El producto no estaba en la lista de deseos' });
    }

    await user.save();
    console.log('Producto eliminado de la lista de deseos con éxito');
    res.status(200).json({ message: 'Producto eliminado de la lista de deseos' });
  } catch (error) {
    console.error('Error al eliminar de la lista de deseos: ', error);
    res.status(500).json({
      message: 'Error al eliminar de la lista de deseos',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};
