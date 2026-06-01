import { Router } from "express";
import {
	cancelSale,
	createSale,
	getAllSales,
	getSaleById,
} from "../controllers/sale.controller.js";
import { validateSaleBody } from "../middlewares/sale.middleware.js";

export const saleRouter = Router();

saleRouter.get("/", getAllSales);
saleRouter.get("/:id", getSaleById);
saleRouter.post("/", validateSaleBody, createSale);
saleRouter.put("/cancel/:id", cancelSale);
