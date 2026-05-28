import type { Request, Response } from "express";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import { Sale } from "../models/sale.js";
import { SaleItem } from "../models/saleItem.js";
import { Stock } from "../models/stock.js";
import { StockMovement } from "../models/stockMovement.js";

export const getDashboardStats = async (_req: Request, res: Response) => {
	try {
		const [
			totalProducts,
			totalCategories,
			monthlySales,
			lowStockProducts,
			recentSales,
			recentMovements,
		] = await Promise.all([
			Product.count(),
			Category.count(),
			Sale.findAll({
				where: {
					status: "completed",
					createdAt: {
						[Op.gte]: new Date(
							new Date().getFullYear(),
							new Date().getMonth(),
							1,
						),
					},
				},
			}),
			Stock.findAll({
				where: { quantity: { [Op.lte]: sequelize.col("minQuantity") } },
				include: [
					{ model: Product, as: "product", attributes: ["id", "name"] },
				],
			}),
			Sale.findAll({
				order: [
					["status", "DESC"],
					["createdAt", "DESC"],
				],
				limit: 5,
				include: [{ model: SaleItem, as: "items" }],
			}),
			StockMovement.findAll({
				order: [["createdAt", "DESC"]],
				limit: 5,
				include: [
					{ model: Product, as: "product", attributes: ["id", "name"] },
				],
			}),
		]);

		const totalMonthlyRevenue = monthlySales.reduce(
			(acc, sale) => acc + Number(sale.getDataValue("total")),
			0,
		);

		res.json({
			totalProducts,
			totalCategories,
			monthlySalesCount: monthlySales.length,
			totalMonthlyRevenue,
			lowStockProducts,
			recentSales,
			recentMovements,
		});
	} catch (_error) {
		res.status(500).json({ message: "Error al obtener estadísticas" });
	}
};
