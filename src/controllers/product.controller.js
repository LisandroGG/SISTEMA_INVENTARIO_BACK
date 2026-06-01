import { Op } from "sequelize";
import { deleteImage, uploadImage } from "../helpers/imageHelper.js";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import {
	validateDuplicate,
	validateExists,
} from "../helpers/validateExists.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import { Stock } from "../models/stock.js";

export const getAllProducts = async (req, res) => {
	try {
		const { name, categoryId } = req.query;
		const { page, limit, offset } = getPagination(req.query, 10);

		const conditions = [];

		if (name) {
			conditions.push({
				name: { [Op.like]: `%${name}%` },
			});
		}
		if (categoryId) {
			conditions.push({
				categoryId: Number(categoryId),
			});
		}

		const whereConditions =
			conditions.length > 0 ? { [Op.and]: conditions } : {};

		const { count: total, rows } = await Product.findAndCountAll({
			where: whereConditions,
			limit,
			offset,
			include: [
				{ model: Category, as: "category" },
				{ model: Stock, as: "stock" },
			],
		});
		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ message: messages.product.getError });
	}
};

export const getAllProductsNoPagination = async (_req, res) => {
	try {
		const products = await Product.findAll({
			attributes: ["id", "name"],
		});
		res.status(200).json(products);
	} catch (_error) {
		res.status(500).json({ message: messages.product.getError });
	}
};

export const getProductById = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findByPk(Number(id), {
			include: [
				{ model: Category, as: "category" },
				{ model: Stock, as: "stock" },
			],
		});
		if (!product) {
			return res.status(404).json({ message: messages.product.notFound });
		}
		res.json(product);
	} catch (_error) {
		res.status(500).json({ message: messages.product.getError });
	}
};

export const createProduct = async (req, res) => {
	const { name, price, categoryId, quantity } = req.body;
	let imgUrl;
	try {
		const isDuplicate = await validateDuplicate(
			Product,
			"name",
			name,
			res,
			messages.product.duplicateName,
		);
		if (isDuplicate) return;
		const category = await validateExists(
			Category,
			Number(categoryId),
			res,
			messages.category.notFound,
		);
		if (!category) return;
		if (req.file) {
			imgUrl = await uploadImage(req.file.buffer, req.file.mimetype);
		}
		const product = await Product.create({
			name,
			price,
			categoryId,
			img: imgUrl,
		});
		await Stock.create({
			productId: product.getDataValue("id"),
			quantity: quantity ?? 0,
		});

		const newProduct = await Product.findByPk(product.getDataValue("id"), {
			include: [
				{ model: Category, as: "category" },
				{ model: Stock, as: "stock" },
			],
		});
		res.status(201).json({
			product: newProduct,
			message: messages.product.createSuccess,
		});
	} catch (_error) {
		res.status(500).json({ message: messages.product.createError });
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { name, price, categoryId } = req.body;
	try {
		const isDuplicate = await validateDuplicate(
			Product,
			"name",
			name,
			res,
			messages.product.duplicateName,
			Number(id),
		);
		if (isDuplicate) return;
		const category = await validateExists(
			Category,
			Number(categoryId),
			res,
			messages.category.notFound,
		);
		if (!category) return;
		const product = await validateExists(
			Product,
			Number(id),
			res,
			messages.product.notFound,
		);
		if (!product) return;
		await product.update({ name, price, categoryId });
		const updatedProduct = await Product.findByPk(Number(id), {
			include: [
				{ model: Category, as: "category" },
				{ model: Stock, as: "stock" },
			],
		});
		res.json({
			product: updatedProduct,
			message: messages.product.updateSuccess,
		});
	} catch (_error) {
		res.status(500).json({ message: messages.product.updateError });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await validateExists(
			Product,
			Number(id),
			res,
			messages.product.notFound,
		);
		if (!product) return;
		const img = product.getDataValue("img");
		if (img) await deleteImage(img);
		await product.destroy();
		res.json({ message: messages.product.deleteSuccess });
	} catch (_error) {
		res.status(500).json({ message: messages.product.deleteError });
	}
};
