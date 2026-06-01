import { Op } from "sequelize";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { validateExists } from "../helpers/validateExists.js";
import { Notification } from "../models/notification.js";
import { Product } from "../models/product.js";
import { Sale } from "../models/sale.js";
import { SaleItem } from "../models/saleItem.js";
import { Stock } from "../models/stock.js";
import { StockMovement } from "../models/stockMovement.js";

export const getAllSales = async (req, res) => {
	try {
		const { status, clientName } = req.query;
		const { page, limit, offset } = getPagination(req.query, 7);

		const conditions = [];

		if (status) {
			conditions.push({
				status: { [Op.like]: `%${status}%` },
			});
		}
		if (clientName) {
			conditions.push({
				clientName: { [Op.like]: `%${clientName}%` },
			});
		}
		const whereConditions =
			conditions.length > 0 ? { [Op.and]: conditions } : {};

		const { count: total, rows } = await Sale.findAndCountAll({
			where: whereConditions,
			limit,
			offset,
			include: [
				{
					model: SaleItem,
					as: "items",
					include: [{ model: Product, as: "product" }],
				},
			],
			order: [["id", "DESC"]],
		});
		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ message: messages.sale.getError });
	}
};

export const getSaleById = async (req, res) => {
	try {
		const { id } = req.params;
		const sale = await Sale.findByPk(Number(id), {
			include: [
				{
					model: SaleItem,
					as: "items",
					include: [
						{
							model: Product,
							as: "product",
							attributes: ["id", "name", "price"],
						},
					],
				},
			],
		});
		if (!sale) {
			return res.status(404).json({ message: messages.sale.notFound });
		}
		res.status(200).json(sale);
	} catch (_error) {
		res.status(500).json({ message: messages.sale.getError });
	}
};

export const createSale = async (req, res) => {
	const { items, clientName } = req.body;
	try {
		let total = 0;
		const saleItems = [];

		for (const item of items) {
			const product = await validateExists(
				Product,
				Number(item.productId),
				res,
				messages.product.notFound,
			);
			if (!product) return;

			const stock = await Stock.findOne({
				where: { productId: item.productId },
			});
			if (!stock || stock.getDataValue("quantity") < item.quantity) {
				return res
					.status(400)
					.json({ message: messages.sale.insufficientStock });
			}

			const unitPrice = product.getDataValue("price");
			total += unitPrice * item.quantity;
			saleItems.push({
				...item,
				unitPrice,
				productName: product.getDataValue("name"),
			});
		}

		const createdSale = await Sale.create({
			total,
			status: "completed",
			clientName,
		});
		const saleId = createdSale.getDataValue("id");

		for (const item of saleItems) {
			await SaleItem.create({
				saleId,
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
			});

			const stock = await Stock.findOne({
				where: { productId: item.productId },
			});
			const currentQuantity = stock?.getDataValue("quantity");
			const newQuantity = currentQuantity - item.quantity;

			await stock?.update({ quantity: newQuantity });

			await StockMovement.create({
				productId: item.productId,
				saleId,
				type: "OUT",
				quantity: item.quantity,
				reason: "Venta",
			});

			if (newQuantity <= stock?.getDataValue("minQuantity")) {
				await Notification.create({
					type: "low_stock",
					message: `Stock bajo en ${item.productName}.`,
					referenceId: item.productId,
					referenceType: "stock",
				});
			}
		}

		const sale = await Sale.findByPk(saleId, {
			include: [
				{
					model: SaleItem,
					as: "items",
					include: [{ model: Product, as: "product" }],
				},
			],
		});

		await Notification.create({
			type: "sale_completed",
			message: `Venta #${saleId} por $${total}.`,
			referenceId: saleId,
			referenceType: "sale",
		});

		res.status(201).json({ sale, message: messages.sale.createSuccess });
	} catch (_error) {
		console.log(_error);
		res.status(500).json({ message: messages.sale.createError });
	}
};

export const cancelSale = async (req, res) => {
	const { id } = req.params;
	try {
		const sale = await Sale.findByPk(Number(id), {
			include: [{ model: SaleItem, as: "items" }],
		});

		if (!sale) {
			return res.status(404).json({ message: messages.sale.notFound });
		}

		if (sale.getDataValue("status") === "cancelled") {
			return res.status(400).json({ message: messages.sale.alreadyCancelled });
		}

		const items = sale.getDataValue("items");

		for (const item of items) {
			const stock = await Stock.findOne({
				where: { productId: item.productId },
			});
			const currentQuantity = stock?.getDataValue("quantity");

			await stock?.update({ quantity: currentQuantity + item.quantity });

			await StockMovement.create({
				productId: item.productId,
				saleId: Number(id),
				type: "IN",
				quantity: item.quantity,
				reason: "Venta cancelada",
			});
		}

		await sale.update({ status: "cancelled" });

		const updatedSale = await Sale.findByPk(Number(id), {
			include: [
				{
					model: SaleItem,
					as: "items",
					include: [{ model: Product, as: "product" }],
				},
			],
		});

		await Notification.create({
			type: "sale_canceled",
			message: `Venta #${id} cancelada.`,
			referenceId: Number(id),
			referenceType: "sale",
		});

		res.json({ sale: updatedSale, message: messages.sale.cancelSuccess });
	} catch (_error) {
		res.status(500).json({ message: messages.sale.cancelError });
	}
};
