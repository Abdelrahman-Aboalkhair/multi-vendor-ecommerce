import express from "express";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import { validateDto } from "@/shared/middlewares/validateDto";
import { CreateCategoryDto } from "./category.dto";
import { makeCategoryController } from "./category.factory";
import upload from "@/shared/middlewares/upload";

const router = express.Router();
const categoryController = makeCategoryController();

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN", "VENDOR"),
  upload.array("images", 5),
  validateDto(CreateCategoryDto),
  categoryController.createCategory
);
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN", "VENDOR"),
  categoryController.deleteCategory
);

export default router;
