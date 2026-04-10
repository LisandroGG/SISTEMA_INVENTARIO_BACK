import type { Request, Response } from "express";
import { messages } from "../helpers/messages.js";
import { Category } from "../models/category.js";

export const getAllCategories = async (_req: Request, res: Response) => {
	try {
		const categories = await Category.findAll();
		res.json(categories);
	} catch (_error) {
		res.status(500).json({ error: messages.category.getError });
	}
};

export const getCategoryById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const category = await Category.findByPk(Number(id));
		if (category) {
			res.json(category);
		} else {
			res.status(404).json({ error: messages.category.notFound });
		}
	} catch (_error) {
		res.status(500).json({ error: messages.category.getError });
	}
};

export const createCategory = async (req: Request, res: Response) => {
	const { name, description } = req.body;
	try {
		const category = await Category.create({ name, description });
		res.status(201).json({
			category,
			message: messages.category.createSuccess,
		});
	} catch (_error) {
		res.status(500).json({ error: messages.category.createError });
	}
};

export const updateCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, description } = req.body;
	try {
		const category = await Category.findByPk(Number(id));
		if (category) {
			await category.update({ name, description });
			res.json({
				category,
				message: messages.category.updateSuccess,
			});
		} else {
			res.status(404).json({ error: messages.category.notFound });
		}
	} catch (_error) {
		res.status(500).json({ error: messages.category.updateError });
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const category = await Category.findByPk(Number(id));
		if (category) {
			await category.destroy();
			res.json({ message: messages.category.deleteSuccess });
		} else {
			res.status(404).json({ error: messages.category.notFound });
		}
	} catch (_error) {
		res.status(500).json({ error: messages.category.deleteError });
	}
};
