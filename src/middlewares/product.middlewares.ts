import type { NextFunction, Request, Response } from "express";
import { messages } from "../helpers/messages.js";

export const validateProductBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name, categoryId } = req.body;
	const price = Number(req.body.price);

	if (name === undefined) {
		return res.status(400).json({ message: messages.product.nameRequired });
	}
	if (!name || typeof name !== "string") {
		return res.status(400).json({ message: messages.product.invalidName });
	}
	if (!price || Number.isNaN(price) || price <= 0) {
		return res.status(400).json({ message: messages.product.invalidPrice });
	}
	if (categoryId === undefined) {
		return res
			.status(400)
			.json({ message: messages.product.categoryIdRequired });
	}

	next();
};

export const validateQuantity = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const quantity = Number(req.body.quantity);

	if (Number.isNaN(quantity) || quantity < 0) {
		return res.status(400).json({ message: messages.product.quantityRequired });
	}

	next();
};
