import fs from 'fs/promises';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, devuelve un array vacío
                return [];
            }
            console.error('Error al leer carritos:', error);
            throw new Error('No se pudieron leer los carritos');
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const maxId = carts.reduce((max, c) => (c.id > max ? c.id : max), 0);
            const newCart = {
                id: maxId + 1,
                products: []
            };
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === Number(cid));
        } catch (error) {
            console.error('Error al obtener carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === Number(cid));
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(product => product.id === Number(pid));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ id: Number(pid), quantity: 1 });
            }

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }
}

export default CartManager;
