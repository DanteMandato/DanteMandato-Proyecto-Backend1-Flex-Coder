import { CartModel } from '../models/carts.Model.js';

export class CartDAO {
    async getCarts() {
        return await CartModel.find().populate('products.product').lean();
    }

    async getCartById(cid) {
        return await CartModel.findById(cid).populate('products.product').lean();
    }

    async createCart() {
        const newCart = new CartModel({ products: [] });
        await newCart.save();
        return newCart;
    }

    async addProductToCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return cart;
    }

    async updateCart(cid, products) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = products;
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(p => p.product.toString() === pid);
        if (!product) throw new Error('Producto no encontrado en el carrito');

        product.quantity = quantity;
        await cart.save();
        return cart;
    }

    async deleteProductFromCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        return cart;
    }

    async clearCart(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        await cart.save();
        return cart;
    }
}
