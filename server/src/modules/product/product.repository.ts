import { Prisma } from "@prisma/client";
import prisma from "@/infra/database/database.config";

export class ProductRepository {
  async findManyProducts(params: {
    where?: Prisma.ProductWhereInput & {
      categorySlug?: string;
      vendorId?: string;
    };
    orderBy?:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[];
    skip?: number;
    take?: number;
    select?: Prisma.ProductSelect;
  }) {
    const {
      where = {},
      orderBy = { createdAt: "desc" },
      skip = 0,
      take = 10,
      select,
    } = params;

    const { categorySlug, vendorId, ...restWhere } = where;

    const finalWhere: Prisma.ProductWhereInput = {
      ...restWhere,
      ...(categorySlug
        ? {
            category: {
              is: {
                slug: {
                  equals: categorySlug,
                  mode: "insensitive",
                },
              },
            },
          }
        : {}),
      ...(vendorId
        ? {
            vendorId: {
              equals: vendorId,
            },
          }
        : {}),
    };

    return prisma.product.findMany({
      where: finalWhere,
      orderBy,
      skip,
      take,
      select,
      include: { category: true, vendor: true },
    });
  }

  async findProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, vendor: true },
    });
  }

  async findProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true, vendor: true },
    });
  }

  async createProduct(data: {
    name: string;
    sku: string;
    isNew: boolean;
    isTrending: boolean;
    isBestSeller: boolean;
    isFeatured: boolean;
    slug: string;
    description?: string;
    price: number;
    discount: number;
    images?: string[];
    stock: number;
    categoryId?: string;
    vendorId?: string;
  }) {
    return prisma.product.create({
      data,
      include: { category: true, vendor: true },
    });
  }

  async createManyProducts(
    data: {
      name: string;
      slug: string;
      description?: string;
      price: number;
      discount: number;
      images: string[];
      stock: number;
      categoryId?: string;
      vendorId?: string;
    }[]
  ) {
    return prisma.product.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      sku: string;
      isNew: boolean;
      isTrending: boolean;
      isBestSeller: boolean;
      isFeatured: boolean;
      slug: string;
      description?: string;
      price: number;
      discount: number;
      images?: string[];
      stock: number;
      categoryId?: string;
      vendorId?: string;
    }>
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true, vendor: true },
    });
  }

  async countProducts(where: any) {
    return prisma.product.count({ where });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
