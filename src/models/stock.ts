import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Stock = sequelize.define(
	"Stock",
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
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		minQuantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 5,
		},
	},
	{
		timestamps: false,
		tableName: "stock",
	},
);
