import { Router } from "express";
import { categoryRouter } from "./category.routes.js";
import { productRouter } from "./product.routes.js";
import { saleRouter } from "./sale.routes.js";
import { stockRouter } from "./stock.routes.js";

export const mainRouter = Router();

mainRouter.get("/", (_req, res) => {
	res.send("Server Working");
});

mainRouter.use("/categories", categoryRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/stocks", stockRouter);
mainRouter.use("/sales", saleRouter);
