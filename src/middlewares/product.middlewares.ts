import type { NextFunction, Request, Response } from "express";
import { messages } from "../helpers/messages.js";

export const validateProductBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name, price, categoryId } = req.body;
	if (name === undefined) {
		return res.status(400).json({ message: messages.product.nameRequired });
	}
	if (!name || typeof name !== "string") {
		return res.status(400).json({ message: messages.product.invalidName });
	}
	if (price === undefined) {
		return res.status(400).json({ message: messages.product.priceRequired });
	}
	if (!price || typeof price !== "number" || price <= 0) {
		return res.status(400).json({ message: messages.product.invalidPrice });
	}
	if (categoryId === undefined) {
		return res
			.status(400)
			.json({ message: messages.product.categoryIdRequired });
	}

	next();
};
