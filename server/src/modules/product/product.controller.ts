import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { ProductService } from "./product.service";
import slugify from "@/shared/utils/slugify";
import { makeLogsService } from "../logs/logs.factory";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";

export class ProductController {
  private logsService = makeLogsService();
  constructor(private productService: ProductService) {}

  getAllProducts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const vendorId = req.query.vendorId;
      const {
        products,
        totalResults,
        totalPages,
        currentPage,
        resultsPerPage,
      } = await this.productService.getAllProducts({
        ...req.query,
        vendorId,
      });
      sendResponse(res, 200, {
        data: {
          products,
          totalResults,
          totalPages,
          currentPage,
          resultsPerPage,
        },
        message: "Products fetched successfully",
      });
    }
  );

  createProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        name,
        description,
        price,
        discount,
        stock,
        categoryId,
        sku,
        isNew,
        isFeatured,
        isTrending,
        isBestSeller,
      } = req.body;
      const slugifiedName = slugify(name);
      const vendorId = undefined;

      const formattedIsNew = isNew === "true";
      const formattedIsFeatured = isFeatured === "true";
      const formattedIsTrending = isTrending === "true";
      const formattedIsBestSeller = isBestSeller === "true";

      const files = req.files as Express.Multer.File[];

      const formattedPrice = Number(price);
      const formattedDiscount = Number(discount);
      const formattedStock = Number(stock);

      let imageUrls: string[] = [];
      if (Array.isArray(files) && files.length > 0) {
        const uploadedImages = await uploadToCloudinary(files);
        imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
      }

      const { product } = await this.productService.createProduct({
        name,
        sku,
        isNew: formattedIsNew,
        isFeatured: formattedIsFeatured,
        isTrending: formattedIsTrending,
        isBestSeller: formattedIsBestSeller,
        slug: slugifiedName,
        description,
        price: formattedPrice,
        discount: formattedDiscount,
        stock: formattedStock,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        categoryId,
        vendorId,
      });

      sendResponse(res, 201, {
        data: product,
        message: "Product created successfully",
      });
      const start = Date.now();
      this.logsService.info("Product created", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  bulkCreateProducts = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    const vendorId = undefined;
    const result = await this.productService.bulkCreateProducts(
      file!,
      vendorId
    );

    sendResponse(res, 201, {
      data: { count: result.count },
      message: `${result.count} products created successfully`,
    });
    const start = Date.now();
    this.logsService.info("Bulk Products created", {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - start,
    });
  });

  updateProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const {
        name,
        description,
        price,
        discount,
        stock,
        categoryId,
        sku,
        isNew,
        isFeatured,
        isTrending,
        isBestSeller,
      } = req.body;
      const vendorId = req.query.vendorId;

      const files = req.files as Express.Multer.File[];

      const formattedIsNew = isNew === "true";
      const formattedIsFeatured = isFeatured === "true";
      const formattedIsTrending = isTrending === "true";
      const formattedIsBestSeller = isBestSeller === "true";

      const formattedPrice = price !== undefined ? Number(price) : undefined;
      const formattedDiscount =
        discount !== undefined ? Number(discount) : undefined;
      const formattedStock = stock !== undefined ? Number(stock) : undefined;

      let imageUrls: string[] = [];
      if (Array.isArray(files) && files.length > 0) {
        const uploadedImages = await uploadToCloudinary(files);
        imageUrls = uploadedImages.map((img) => img.url).filter(Boolean);
      }

      const updatedData: any = {
        ...(name && { name, slug: slugify(name) }),
        ...(sku && { sku }),
        ...(formattedIsNew !== undefined && { isNew: formattedIsNew }),
        ...(formattedIsFeatured !== undefined && {
          isFeatured: formattedIsFeatured,
        }),
        ...(formattedIsTrending !== undefined && {
          isTrending: formattedIsTrending,
        }),
        ...(formattedIsBestSeller !== undefined && {
          isBestSeller: formattedIsBestSeller,
        }),
        ...(description && { description }),
        ...(formattedPrice !== undefined && { price: formattedPrice }),
        ...(formattedDiscount !== undefined && { discount: formattedDiscount }),
        ...(formattedStock !== undefined && { stock: formattedStock }),
        ...(imageUrls.length > 0 && { images: imageUrls }),
        ...(categoryId && { categoryId }),
      };

      const product = await this.productService.updateProduct(
        productId,
        updatedData,
        vendorId as string | undefined
      );

      sendResponse(res, 200, {
        data: product,
        message: "Product updated successfully",
      });

      const start = Date.now();
      this.logsService.info("Product updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  deleteProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id: productId } = req.params;
      const vendorId = undefined;
      await this.productService.deleteProduct(productId, vendorId);
      sendResponse(res, 200, { message: "Product deleted successfully" });
      const start = Date.now();
      this.logsService.info("Product deleted", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );
}
