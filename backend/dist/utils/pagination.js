export const getPaginatedData = async (model, query = {}, page = 1, limit = 10, sort = { createdAt: -1 }, pagination = true, populate = "") => {
    if (!pagination) {
        const data = await model.find(query).sort(sort).populate(populate);
        const totalCount = data.length;
        return {
            data,
            totalCount,
            totalPages: 1,
            currentPage: 1,
            limit: totalCount,
            hasPrev: false,
            hasNext: false,
        };
    }
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
        model.find(query).sort(sort).skip(skip).limit(limit).populate(populate),
        model.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    const hasPrev = page > 1;
    const hasNext = page < totalPages;
    return {
        data,
        totalCount,
        totalPages,
        currentPage: page,
        limit,
        hasPrev,
        hasNext,
    };
};
//# sourceMappingURL=pagination.js.map