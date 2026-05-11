import { Model } from "mongoose";

export interface PaginationResult<T> {
    data: T[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasPrev: boolean;
    hasNext: boolean;
}

export const getPaginatedData = async <T>(
    model: Model<T>,
    query: object = {},
    page: number = 1,
    limit: number = 10,
    sort: object = { createdAt: -1 },
    pagination: boolean = true,
    populate: string | string[] | any = ""
): Promise<PaginationResult<T>> => {
    
    if (!pagination) {
        const data = await model.find(query).sort(sort as any).populate(populate);
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
        model.find(query).sort(sort as any).skip(skip).limit(limit).populate(populate),
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
