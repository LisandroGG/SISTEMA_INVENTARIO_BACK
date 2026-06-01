import { messages } from "../helpers/messages.js";

export const validateCategoryBody = (req, res, next) => {
	const { name } = req.body;

	if (!name) {
		res.status(400).json({ error: messages.category.nameRequired });
		return;
	}

	next();
};
