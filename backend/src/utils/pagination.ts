import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/client";

type PaginateArgs<T> = T & {
    page?: number;
    limit?: number;
};

export async function paginate<
    TArgs extends {
        select?: Prisma.UserSelect<DefaultArgs> | null | undefined;
        omit?: Prisma.UserOmit<DefaultArgs> | null | undefined;
        include?: Prisma.UserInclude<DefaultArgs> | null | undefined;
        where?: Prisma.UserWhereInput | undefined;
        orderBy?: (Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]) | undefined;
        cursor?: Prisma.UserWhereUniqueInput | undefined;
        take?: number | undefined;
        skip?: number | undefined;
        distinct?: (Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[]) | undefined;
    },
>(
    model: {
        findMany(args: TArgs): Promise<any[]>;
        count(args: { where?: TArgs["where"] }): Promise<number>;
    },
    args: PaginateArgs<TArgs>,
) {
    const { page = 1, limit = 10, ...rest } = args;

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit <= 0 ? 10 : limit;

    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        model.findMany({
            ...(rest as TArgs),
            skip,
            take: safeLimit,
        }),
        model.count({
            where: (rest as TArgs).where,
        }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data,
        meta: {
            total,
            totalPages,
            page: safePage,
            limit: safeLimit,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1,
        },
    };
}
