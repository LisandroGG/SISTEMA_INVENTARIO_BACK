import type { Request, Response } from "express";
import { messages } from "../helpers/messages.js";
import { Notification } from "../models/notification.js";
import { Product } from "../models/product.js";
import { Stock } from "../models/stock.js";
import { StockMovement } from "../models/stockMovement.js";

export const getAllStocks = async (_req: Request, res: Response) => {
	try {
		const stocks = await Stock.findAll({
			include: [{ model: Product, as: "product" }],
		});
		res.json(stocks);
	} catch (_error) {
		res.status(500).json({ message: messages.stock.getError });
	}
};

export const getStockByProductId = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const stock = await Stock.findOne({
			where: { productId: id },
			include: [{ model: Product, as: "product" }],
		});
		if (!stock) {
			return res.status(404).json({ message: messages.stock.notFound });
		}
		res.json(stock);
	} catch (_error) {
		res.status(500).json({ message: messages.stock.getError });
	}
};

export const adjustStock = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { quantity, reason } = req.body;

		const stock = await Stock.findOne({
			where: { productId: id },
			include: [{ model: Product, as: "product" }],
		});

		if (!stock) {
			return res.status(404).json({ message: messages.stock.notFound });
		}

		const currentQuantity = stock.getDataValue("quantity");

		await stock.update({ quantity });

		const difference = quantity - currentQuantity;
		const movementType = difference > 0 ? "IN" : "OUT";

		await StockMovement.create({
			productId: stock.getDataValue("productId"),
			type: movementType,
			quantity: Math.abs(difference),
			reason: reason,
		});

		if (quantity <= stock.getDataValue("minQuantity")) {
			await Notification.create({
				type: "low_stock",
				message: `Stock bajo para el producto ${stock.getDataValue("product").id}.`,
				referenceId: stock.getDataValue("productId"),
				referenceType: "stock",
			});
		}

		res.json({
			stock,
			message: messages.stock.adjustSuccess,
		});
	} catch (_error) {
		res.status(500).json({ message: messages.stock.adjustError });
	}
};

export const updateMinStock = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { minQuantity } = req.body;

		const stock = await Stock.findOne({
			where: { productId: id },
			include: [{ model: Product, as: "product" }],
		});

		if (!stock) {
			return res.status(404).json({ message: messages.stock.notFound });
		}

		await stock.update({ minQuantity });

		res.json({
			stock,
			message: messages.stock.updateMinSuccess,
		});
	} catch (_error) {
		res.status(500).json({ message: messages.stock.updateMinError });
	}
};
