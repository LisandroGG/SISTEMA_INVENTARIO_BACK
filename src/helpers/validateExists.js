import { Op } from "sequelize";

export const validateExists = async (model, id, res, errorMessage) => {
	const modelExists = await model.findByPk(id);
	if (!modelExists) {
		res.status(404).json({ message: errorMessage });
		return null;
	}
	return modelExists;
};

export const validateDuplicate = async (
	model,
	field,
	value,
	res,
	errorMessage,
	excludeId,
) => {
	const where = { [field]: value };

	if (excludeId) {
		where.id = { [Op.ne]: excludeId };
	}

	const duplicate = await model.findOne({ where });
	if (duplicate) {
		res.status(409).json({ message: errorMessage });
		return true;
	}
	return false;
};
