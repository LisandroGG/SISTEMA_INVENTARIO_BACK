import type { NextFunction, Request, Response } from "express";
import { messages } from "../helpers/messages.js";

export const validateAdjustBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { quantity, reason } = req.body;

	if (quantity === undefined || typeof quantity !== "number") {
		return res.status(400).json({ message: messages.stock.quantityRequired });
	}
	if (!reason || typeof reason !== "string") {
		return res.status(400).json({ message: messages.stock.reasonRequired });
	}

	next();
};

export const validateMinQuantityBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { minQuantity } = req.body;

	if (
		minQuantity === undefined ||
		typeof minQuantity !== "number" ||
		minQuantity <= 0
	) {
		return res
			.status(400)
			.json({ message: messages.stock.minQuantityRequired });
	}

	next();
};
