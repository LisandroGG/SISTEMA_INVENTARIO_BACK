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
} from "../middlewares/product.middlewares.js";
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
productRouter.put(
	"/:id",
	upload.single("img"),
	validateProductBody,
	updateProduct,
);
productRouter.delete("/:id", deleteProduct);
