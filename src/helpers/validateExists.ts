import type { Response } from "express";
import type { Model, ModelStatic } from "sequelize";

export const validateExists = async (
	model: ModelStatic<Model>,
	id: number,
	res: Response,
	errorMessage: string,
) => {
	const modelExists = await model.findByPk(id);
	if (!modelExists) {
		res.status(404).json({ message: errorMessage });
		return null;
	}
	return modelExists;
};

export const validateDuplicate = async (
	model: ModelStatic<Model>,
	field: string,
	value: string,
	res: Response,
	errorMessage: string,
) => {
	const duplicate = await model.findOne({ where: { [field]: value } });
	if (duplicate) {
		res.status(409).json({ message: errorMessage });
		return true;
	}
	return false;
};
