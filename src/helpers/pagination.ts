export const getPagination = (query: { page?: string }, fixedLimit = 9) => {
	const page = Number(query.page) > 0 ? Number(query.page) : 1;
	const limit = fixedLimit;
	const offset = (page - 1) * limit;

	return { page, limit, offset };
};

export const buildPagedResponse = <T>(
	rows: T[],
	totalItems: number,
	page: number,
	limit: number,
) => {
	return {
		data: rows,
		page,
		limit,
		totalItems,
		totalPages: Math.ceil(totalItems / limit),
		hasNext: page * limit < totalItems,
		hasPrev: page > 1,
	};
};
