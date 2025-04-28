import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./category.dto";
import { makeLogsService } from "../logs/logs.factory";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";

export class CategoryController {
  private logsService = makeLogsService();
  constructor(private categoryService: CategoryService) {}

  createCategory = asyncHandler(
    async (
      req: Request<any, any, CreateCategoryDto>,
      res: Response
    ): Promise<void> => {
      const { name } = req.body;
      const files = req.files as Express.Multer.File[];
      const vendorId = req.query.vendorId;
      let imageUrls: string[] = [];
      if (Array.isArray(files) && files.length > 0) {
        const uploadedImages = await uploadToCloudinary(files);
        imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
      }

      const { category } = await this.categoryService.createCategory({
        name,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        vendorId: vendorId as string | undefined,
      });
      sendResponse(res, 201, {
        data: { category },
        message: "Category created successfully",
      });
      const start = Date.now();
      this.logsService.info("Category created", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  getAllCategories = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const vendorId = req.query.vendorId;
      const categories = await this.categoryService.getAllCategories({
        ...req.query,
        vendorId,
      });
      sendResponse(res, 200, {
        data: { categories },
        message: "Categories fetched successfully",
      });
    }
  );

  deleteCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: categoryId } = req.params;
      const vendorId = req.query.vendorId;
      await this.categoryService.deleteCategory(
        categoryId,
        vendorId as string | undefined
      );
      sendResponse(res, 204, { message: "Category deleted successfully" });
      const start = Date.now();
      this.logsService.info("Category deleted", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );
}
