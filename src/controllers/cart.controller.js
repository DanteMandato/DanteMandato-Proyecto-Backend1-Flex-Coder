import { CartDAO } from "../dao/CartDAO.js";
import { ProductDAO } from "../dao/ProductDAO.js";
import { TicketModel } from "../models/ticket.Model.js";
import { v4 as uuidv4 } from 'uuid';

const cartService = new CartDAO();
const productService = new ProductDAO();

export const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productsToBuy = [];
    const productsOutOfStock = [];

    for (const item of cart.products) {
        const product = await productService.getProductById(item.product._id);

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await productService.updateProduct(product._id, { stock: product.stock });
            productsToBuy.push({
                id: product._id,
                quantity: item.quantity,
                price: product.price,
                subtotal: item.quantity * product.price
            });
        } else {
            productsOutOfStock.push(item);
        }
    }

    if (productsToBuy.length > 0) {
        const totalAmount = productsToBuy.reduce((acc, item) => acc + item.subtotal, 0);

        const ticket = await TicketModel.create({
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: "cliente@email.com"
        });

        await cartService.updateCart(cartId, productsOutOfStock);

        return res.status(200).json({
            status: 'success',
            message: 'Compra realizada',
            ticket,
            productsOutOfStock
        });
    } else {
        return res.status(400).json({
            status: 'error',
            message: 'No hay stock suficiente para ningún producto',
            productsOutOfStock
        });
    }
};

export const getCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        const cartWithDetails = {
            _id: cart._id,
            products: cart.products.map(item => ({
                _id: item.product._id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.quantity * item.product.price,
                thumbnail: item.product.thumbnail
            }))
        };

        cartWithDetails.total = cartWithDetails.products.reduce((acc, item) => acc + item.subtotal, 0);

        res.status(200).json({ status: 'success', cart: cartWithDetails });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener carrito", error });
    }
};

