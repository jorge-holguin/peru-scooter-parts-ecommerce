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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asegurarse de que wishlist es un array
    user.wishlist = user.wishlist || [];

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ message: 'Producto agregado a la lista de deseos' });
    } else {
      res.status(400).json({ message: 'El producto ya está en la lista de deseos' });
    }
  } catch (error) {
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
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asegurarse de que wishlist es un array
    user.wishlist = user.wishlist || [];

    user.wishlist = user.wishlist.filter(
      (id: any) => id.toString() !== productId
    );

    await user.save();
    res.status(200).json({ message: 'Producto eliminado de la lista de deseos' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar de la lista de deseos',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};
