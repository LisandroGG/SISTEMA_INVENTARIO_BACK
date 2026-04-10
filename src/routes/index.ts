import { Router } from "express";
import { categoryRouter } from "./category.routes.js";
import { productRouter } from "./product.routes.js";

export const mainRouter = Router();

mainRouter.get("/", (_req, res) => {
	res.send("Server Working");
});

mainRouter.use("/categories", categoryRouter);
mainRouter.use("/products", productRouter);
