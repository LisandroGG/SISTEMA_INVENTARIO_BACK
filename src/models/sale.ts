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
		clientName: {
			type: DataTypes.STRING,
			allowNull: false,
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
	},
	{
		timestamps: true,
		tableName: "sales",
	},
);
