import { Router } from 'express';
import { CartDAO } from '../dao/CartDAO.js';
import { ProductDAO } from '../dao/ProductDAO.js';

const router = Router();
const cartDAO = new CartDAO();
const productDAO = new ProductDAO();

router.post('/purchase/:cid', async (req, res) => {
    const { cid } = req.params;
    const { paymentMethod, cardDetails } = req.body;

    try {
        if (!paymentMethod) {
            return res.status(400).json({ error: 'Debe seleccionar un método de pago.' });
        }

        if ((paymentMethod === 'tarjeta' || paymentMethod === 'debito') && (!cardDetails || !cardDetails.number || !cardDetails.name || !cardDetails.exp || !cardDetails.cvv)) {
            return res.status(400).json({ error: 'Datos de tarjeta incompletos.' });
        }

        const cart = await cartDAO.getCartById(cid);
        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ error: 'El carrito no existe o está vacío.' });
        }

        const notProcessed = [];
        const ticketProducts = [];
        let total = 0;

        for (const item of cart.products) {
            const product = await productDAO.getProductById(item.product._id);
            if (product && product.stock >= item.quantity) {
                await productDAO.updateProduct(product._id, {
                    stock: product.stock - item.quantity
                });
                ticketProducts.push({
                    _id: product._id,
                    title: product.title,
                    quantity: item.quantity,
                    price: product.price
                });
                total += product.price * item.quantity;
            } else {
                notProcessed.push({
                    _id: product._id,
                    title: product.title,
                    requested: item.quantity,
                    available: product?.stock || 0
                });
            }
        }

        await cartDAO.updateCartProducts(cid, notProcessed.map(p => ({
            product: p._id,
            quantity: p.requested
        })));

        const ticket = {
            code: 'TCKT-' + Date.now(),
            amount: total,
            purchaser: 'usuario@ejemplo.com',
            products: ticketProducts,
            payment: paymentMethod
        };

        return res.status(200).json({
            message: 'Compra procesada con éxito.',
            ticket,
            notProcessed
        });

    } catch (error) {
        console.error('Error en purchase:', error);
        return res.status(500).json({ error: 'Error interno al procesar la compra.' });
    }
});

export default router;
