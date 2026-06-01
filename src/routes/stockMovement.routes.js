import { Router } from "express";
import { getAllStockMovements } from "../controllers/stockMovement.controller.js";

export const stockMovementRouter = Router();

stockMovementRouter.get("/", getAllStockMovements);
