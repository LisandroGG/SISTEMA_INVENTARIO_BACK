import type { Request, Response } from "express";
import { Op } from "sequelize";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { Product } from "../models/product.js";
import { StockMovement } from "../models/stockMovement.js";

export const getAllStockMovements = async (req: Request, res: Response) => {
	try {
		const { type, dateFrom, dateTo } = req.query;
		const { page, limit, offset } = getPagination(req.query, 9);

		const conditions: Record<string, unknown>[] = [];

		if (type) {
			conditions.push({ type });
		}
		if (dateFrom) {
			conditions.push({
				createdAt: { [Op.gte]: new Date(dateFrom as string) },
			});
		}

		if (dateTo) {
			conditions.push({
				createdAt: { [Op.lte]: new Date(dateTo as string) },
			});
		}

		console.log("dateTo:", dateTo);
		console.log("DATE query:", dateFrom, dateTo);

		const whereConditions =
			conditions.length > 0 ? { [Op.and]: conditions } : {};

		const { count: total, rows } = await StockMovement.findAndCountAll({
			where: whereConditions,
			include: [{ model: Product, as: "product", attributes: ["id", "name"] }],
			limit,
			offset,
			order: [["createdAt", "DESC"]],
		});

		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ message: messages.stockMovement.getError });
	}
};
