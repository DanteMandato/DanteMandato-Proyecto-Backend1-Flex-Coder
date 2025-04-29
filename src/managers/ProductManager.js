import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer productos:', error);
            throw new Error('No se pudieron leer los productos');
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === Number(id));
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            if (
                !productData.title ||
                !productData.category ||
                productData.price == null ||
                productData.status == null ||
                !productData.code ||
                productData.stock == null
            ) {
                throw new Error('Faltan datos requeridos para agregar el producto');
            }

            const products = await this.getProducts();
            const exist = products.find(product => product.code === productData.code);
            if (exist) {
                throw new Error('El producto ya existe');
            }

            const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
            const newProduct = {
                ...productData,
                id: maxId + 1
            };

            products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedData) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === Number(id));
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            products[productIndex] = { ...products[productIndex], ...updatedData };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[productIndex];
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const newProducts = products.filter(product => product.id !== Number(id));
            if (products.length === newProducts.length) {
                throw new Error('Producto no encontrado para eliminar');
            }

            await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
            return id;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

export default ProductManager;
