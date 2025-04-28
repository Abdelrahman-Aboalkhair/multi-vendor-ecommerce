import AppError from "@/shared/errors/AppError";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { ProductRepository } from "./product.repository";
import slugify from "@/shared/utils/slugify";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import prisma from "@/infra/database/database.config";

type ProductUpdateData = Partial<{
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  stock: number;
  categoryId?: string;
  vendorId?: string;
}>;

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(queryString: Record<string, any>) {
    const apiFeatures = new ApiFeatures(queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    const { where, orderBy, skip, take, select } = apiFeatures;

    const finalWhere = {
      ...where,
      ...(queryString.vendorId && { vendorId: queryString.vendorId }),
    };

    const totalResults = await this.productRepository.countProducts({
      where: finalWhere,
    });

    const totalPages = Math.ceil(totalResults / take);
    const currentPage = Math.floor(skip / take) + 1;

    const products = await this.productRepository.findManyProducts({
      where: finalWhere,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
      select,
    });

    return {
      products,
      totalResults,
      totalPages,
      currentPage,
      resultsPerPage: take,
    };
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
    if (data.vendorId) {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: data.vendorId },
      });
      if (!vendor) {
        throw new AppError(400, "Invalid vendor ID");
      }
    }
    const product = await this.productRepository.createProduct(data);
    return { product };
  }

  async bulkCreateProducts(file: Express.Multer.File, vendorId?: string) {
    if (!file) {
      throw new AppError(400, "No file uploaded");
    }

    let records: any[];
    try {
      if (file.mimetype === "text/csv") {
        records = parse(file.buffer.toString(), {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        records = XLSX.utils.sheet_to_json(sheet);
      } else {
        throw new AppError(400, "Unsupported file format. Use CSV or XLSX");
      }
    } catch (error) {
      throw new AppError(400, "Failed to parse file");
    }

    if (records.length === 0) {
      throw new AppError(400, "File is empty");
    }

    const products = records.map((record) => {
      if (!record.name || !record.price || !record.stock) {
        throw new AppError(400, `Invalid record: ${JSON.stringify(record)}`);
      }

      return {
        name: String(record.name),
        slug: slugify(record.name),
        description: record.description
          ? String(record.description)
          : undefined,
        price: Number(record.price),
        discount: record.discount ? Number(record.discount) : 0,
        images: record.images
          ? String(record.images)
              .split(",")
              .map((img: string) => img.trim())
          : [],
        stock: Number(record.stock),
        categoryId: record.categoryId ? String(record.categoryId) : undefined,
        vendorId,
        isNew: record.isNew ? Boolean(record.isNew) : false,
        isTrending: record.isTrending ? Boolean(record.isTrending) : false,
        isBestSeller: record.isBestSeller
          ? Boolean(record.isBestSeller)
          : false,
        isFeatured: record.isFeatured ? Boolean(record.isFeatured) : false,
      };
    });

    if (vendorId) {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: vendorId },
      });
      if (!vendor) {
        throw new AppError(400, "Invalid vendor ID");
      }
    }

    const categoryIds = products
      .filter((p) => p.categoryId)
      .map((p) => p.categoryId!);
    if (categoryIds.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });
      const validCategoryIds = new Set(existingCategories.map((c) => c.id));
      for (const product of products) {
        if (product.categoryId && !validCategoryIds.has(product.categoryId)) {
          throw new AppError(400, `Invalid categoryId: ${product.categoryId}`);
        }
      }
    }

    await this.productRepository.createManyProducts(products);

    return { count: products.length };
  }

  async updateProduct(
    productId: string,
    updatedData: ProductUpdateData,
    vendorId?: string
  ) {
    const existingProduct = await this.productRepository.findProductById(
      productId
    );
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }
    if (vendorId && existingProduct.vendorId !== vendorId) {
      throw new AppError(403, "Not authorized to update this product");
    }

    const product = await this.productRepository.updateProduct(
      productId,
      updatedData
    );
    return product;
  }

  async deleteProduct(productId: string, vendorId?: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    if (vendorId && product.vendorId !== vendorId) {
      throw new AppError(403, "Not authorized to delete this product");
    }

    await this.productRepository.deleteProduct(productId);
  }
}
