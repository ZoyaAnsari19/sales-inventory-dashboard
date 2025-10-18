import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; 
    // items = [{ productId: "64ad...", quantity: 2 }, ...]

    // 1️⃣ Order save karo
    const order = new Order({ items, createdAt: new Date() });
    await order.save();

    // 2️⃣ Har product ka salesCount update karo
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { salesCount: item.quantity } }
      );
    }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
