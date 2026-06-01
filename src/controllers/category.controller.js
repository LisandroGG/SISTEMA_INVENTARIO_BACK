import { literal, Op } from "sequelize";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { validateDuplicate } from "../helpers/validateExists.js";
import { Category } from "../models/category.js";

export const getAllCategories = async (req, res) => {
	try {
		const { name } = req.query;
		const { page, limit, offset } = getPagination(req.query, 9);

		const conditions = [];

		if (name) {
			conditions.push({
				name: { [Op.like]: `%${name}%` },
			});
		}

		const whereConditions =
			conditions.length > 0 ? { [Op.and]: conditions } : {};

		const { count: total, rows } = await Category.findAndCountAll({
			where: whereConditions,
			limit,
			offset,
			attributes: {
				include: [
					[
						literal(`(
                            SELECT COUNT(*)
                            FROM Products AS product
                            WHERE product.categoryId = Category.id
                        )`),
						"totalProducts",
					],
				],
			},
		});
		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ error: messages.category.getError });
	}
};

export const getAllCategoriesNoPagination = async (_req, res) => {
	try {
		const categories = await Category.findAll();
		res.status(200).json(categories);
	} catch (_error) {
		res.status(500).json({ error: messages.category.getError });
	}
};

export const getCategoryById = async (req, res) => {
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

export const createCategory = async (req, res) => {
	const { name } = req.body;
	try {
		const isDuplicate = await validateDuplicate(
			Category,
			"name",
			name,
			res,
			messages.category.duplicateName,
		);
		if (isDuplicate) return;
		const category = await Category.create({ name });
		res.status(201).json({
			category,
			message: messages.category.createSuccess,
		});
	} catch (_error) {
		res.status(500).json({ error: messages.category.createError });
	}
};

export const updateCategory = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	try {
		const isDuplicate = await validateDuplicate(
			Category,
			"name",
			name,
			res,
			messages.category.duplicateName,
		);
		if (isDuplicate) return;
		const category = await Category.findByPk(Number(id));
		if (category) {
			await category.update({ name });
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

export const deleteCategory = async (req, res) => {
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
