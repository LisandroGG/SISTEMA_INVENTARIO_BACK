import { Router } from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getAllProductsNoPagination,
	getProductById,
	updateProduct,
} from "../controllers/product.controller.js";
import {
	validateProductBody,
	validateQuantity,
} from "../middlewares/product.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/no-pagination", getAllProductsNoPagination);
productRouter.get("/:id", getProductById);
productRouter.post(
	"/",
	upload.single("img"),
	validateProductBody,
	validateQuantity,
	createProduct,
);
productRouter.put("/:id", validateProductBody, updateProduct);
productRouter.delete("/:id", deleteProduct);
