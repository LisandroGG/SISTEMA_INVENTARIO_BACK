import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const SaleItem = sequelize.define(
	"SaleItem",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		saleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		unitPrice: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
	},
	{
		timestamps: false,
		tableName: "sale_items",
	},
);
