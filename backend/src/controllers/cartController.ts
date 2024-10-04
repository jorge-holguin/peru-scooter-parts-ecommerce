import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// Agregar un producto al carrito
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { productId, quantity } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const cartItemIndex = user.cart.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // Si no, agrega el nuevo producto al carrito
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Producto agregado al carrito', cart: user.cart });
  } catch (error) {
    res.status(500).json({
      message: 'Error al agregar al carrito',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Obtener el carrito del usuario
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const user = await User.findById(userId).populate('cart.product');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el carrito',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { productId, quantity } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const cartItem = user.cart.find(
      (item: any) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save();
      res.status(200).json({ message: 'Cantidad actualizada', cart: user.cart });
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el carrito',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { productId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.cart = user.cart.filter(
      (item: any) => item.product.toString() !== productId
    );

    await user.save();
    res.status(200).json({ message: 'Producto eliminado del carrito', cart: user.cart });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar del carrito',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Eliminar todos los productos del carrito
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    
  // Limpiar el carrito del usuario
  user.cart = [];
  await user.save();

   res.status(200).json({ message: 'Carrito eliminado con éxito', cart: user.cart });
  } catch (error) {
  res.status(500).json({
    message: 'Error al eliminar el carrito',
    error: error instanceof Error ? error.message : 'Error desconocido',
  });
  }
};
