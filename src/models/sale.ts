import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Sale = sequelize.define(
	"Sale",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		status: {
			type: DataTypes.ENUM("pending", "completed", "cancelled"),
			allowNull: false,
			defaultValue: "pending",
		},
		total: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0,
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: "sales",
	},
);
