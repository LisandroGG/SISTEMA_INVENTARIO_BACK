import { Router } from "express";
import {
	adjustStock,
	getAllStocks,
	getStockByProductId,
	updateMinStock,
} from "../controllers/stock.controller.js";
import {
	validateAdjustBody,
	validateMinQuantityBody,
} from "../middlewares/stock.middleware.js";

export const stockRouter = Router();

stockRouter.get("/", getAllStocks);
stockRouter.get("/:id", getStockByProductId);
stockRouter.put("/adjust/:id", validateAdjustBody, adjustStock);
stockRouter.put("/min/:id", validateMinQuantityBody, updateMinStock);
