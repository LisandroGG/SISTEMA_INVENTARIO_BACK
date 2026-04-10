import type { NextFunction, Request, Response } from "express";
import { messages } from "../helpers/messages.js";

export const validateCategoryBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name } = req.body;

	if (!name) {
		res.status(400).json({ error: messages.category.nameRequired });
		return;
	}

	next();
};
