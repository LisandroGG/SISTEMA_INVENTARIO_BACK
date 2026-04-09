import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Notification = sequelize.define(
	"Notification",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.ENUM("low_stock", "sale_completed", "adjustment"),
			allowNull: false,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		read: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		referenceId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		referenceType: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		tableName: "notifications",
	},
);
