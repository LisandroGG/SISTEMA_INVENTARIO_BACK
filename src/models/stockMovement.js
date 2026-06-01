import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const StockMovement = sequelize.define(
	"StockMovement",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		saleId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM("IN", "OUT"),
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: "stock_movements",
	},
);
