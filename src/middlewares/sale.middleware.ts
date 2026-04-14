import type { NextFunction, Request, Response } from "express";
import { messages } from "../helpers/messages.js";

export const validateSaleBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { items } = req.body;

	if (!items || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ message: messages.sale.itemsRequired });
	}

	for (const item of items) {
		if (!item.productId) {
			return res.status(400).json({ message: messages.sale.productIdRequired });
		}
		if (
			!item.quantity ||
			typeof item.quantity !== "number" ||
			item.quantity <= 0
		) {
			return res.status(400).json({ message: messages.sale.quantityRequired });
		}
	}

	next();
};
