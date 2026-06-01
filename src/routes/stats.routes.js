import { Router } from "express";
import { getDashboardStats } from "../controllers/stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/", getDashboardStats);
