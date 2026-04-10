import { Router } from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	updateProduct,
} from "../controllers/product.controller.js";
import { validateProductBody } from "../middlewares/product.middlewares.js";

export const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", validateProductBody, createProduct);
productRouter.put("/:id", validateProductBody, updateProduct);
productRouter.delete("/:id", deleteProduct);
