import { ProductModel } from '../models/product.Model.js';

export class ProductDAO {
    async getProducts({ limit = 10, page = 1, sort, query }) {
        const filter = query ? {
            $or: [
                { category: { $regex: query, $options: 'i' } },
                { status: query === 'true' ? true : query === 'false' ? false : undefined }
            ]
        } : {};

        const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
            lean: true
        };

        const result = await ProductModel.paginate(filter, options);

        return {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
        };
    }

    async getProductById(id) {
        return await ProductModel.findById(id).lean();
    }

    async addProduct(product) {
        return await ProductModel.create(product);
    }

    async updateProduct(id, update) {
        return await ProductModel.findByIdAndUpdate(id, update, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}
