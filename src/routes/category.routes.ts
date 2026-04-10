import { Router } from "express";
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
} from "../controllers/category.controller.js";
import { validateCategoryBody } from "../middlewares/category.middleware.js";

export const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", validateCategoryBody, createCategory);
categoryRouter.put("/:id", validateCategoryBody, updateCategory);
categoryRouter.delete("/:id", deleteCategory);
