import { ProductDAO } from "../dao/ProductDAO.js";

const productService = new ProductDAO();

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const result = await productService.getProducts({ limit, page, sort, query });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error al obtener productos", error });
    }
};
