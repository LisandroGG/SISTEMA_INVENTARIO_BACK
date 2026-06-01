import { Router } from "express";
import { categoryRouter } from "./category.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { productRouter } from "./product.routes.js";
import { saleRouter } from "./sale.routes.js";
import { statsRouter } from "./stats.routes.js";
import { stockRouter } from "./stock.routes.js";
import { stockMovementRouter } from "./stockMovement.routes.js";

export const mainRouter = Router();

mainRouter.get("/", (_req, res) => {
	res.send("Server Working");
});

mainRouter.use("/categories", categoryRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/stocks", stockRouter);
mainRouter.use("/sales", saleRouter);
mainRouter.use("/notifications", notificationRouter);
mainRouter.use("/movements", stockMovementRouter);
mainRouter.use("/stats", statsRouter);
