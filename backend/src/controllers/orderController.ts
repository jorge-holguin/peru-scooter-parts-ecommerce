// backend/src/controllers/orderController.ts

import { Request, Response } from 'express';
import Order from '../models/Order';

interface AuthRequest extends Request {
  user?: any;
}

// Crear un nuevo pedido
export const addOrderItems = async (req: AuthRequest, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No hay artículos en el pedido' });
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el pedido',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Obtener un pedido por ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el pedido',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Actualizar pedido a pagado
export const updateOrderToPaid = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el pedido',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

// Obtener todas las órdenes del usuario autenticado
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('orderItems.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las órdenes del usuario',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};