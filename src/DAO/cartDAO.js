import CartModel from '../models/carts.Model.js';

class CartDao {
    async getCarts() {
        return await CartModel.find().populate('products.product');
    }

    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(cid) {
        return await CartModel.findById(cid).populate('products.product');
    }

    async addProductToCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return await cart.populate('products.product');
    }

    async removeProductFromCart(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        return await cart.populate('products.product');
    }

    async clearCart(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        await cart.save();
        return await cart.populate('products.product');
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) throw new Error('Producto no encontrado en el carrito');

        productInCart.quantity = quantity;
        await cart.save();
        return await cart.populate('products.product');
    }

    async updateCart(cid, products) {
        const cart = await CartModel.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');


        cart.products = products.map(p => ({
            product: p.product,
            quantity: p.quantity
        }));

        await cart.save();
        return await cart.populate('products.product');
    }
}

export default CartDao;
