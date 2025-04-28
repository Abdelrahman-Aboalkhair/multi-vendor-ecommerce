import AppError from "@/shared/errors/AppError";
import slugify from "@/shared/utils/slugify";
import ApiFeatures from "@/shared/utils/ApiFeatures";
import { CategoryRepository } from "./category.repository";
import prisma from "@/infra/database/database.config";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(queryString: Record<string, any>) {
    const apiFeatures = new ApiFeatures(queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .build();

    const { where, orderBy, skip, take } = apiFeatures;

    const finalWhere = {
      ...where,
      ...(queryString.vendorId && { vendorId: queryString.vendorId }),
    };

    return await this.categoryRepository.findManyCategories({
      where: finalWhere,
      orderBy: orderBy || { createdAt: "desc" },
      skip,
      take,
    });
  }

  async createCategory(data: {
    name: string;
    images?: string[];
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
    const category = await this.categoryRepository.createCategory({
      name: data.name,
      slug: slugify(data.name),
      images: data.images,
      vendorId: data.vendorId,
    });
    return { category };
  }

  async deleteCategory(categoryId: string, vendorId?: string) {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    if (vendorId && category.vendorId !== vendorId) {
      throw new AppError(403, "Not authorized to delete this category");
    }
    await this.categoryRepository.deleteCategory(categoryId);
  }
}
