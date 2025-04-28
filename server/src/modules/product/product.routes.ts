import express from "express";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import protect from "@/shared/middlewares/protect";
import { makeProductController } from "./product.factory";
import upload from "@/shared/middlewares/upload";

const router = express.Router();
const productController = makeProductController();

router.get("/", productController.getAllProducts);
// router.get("/:id", productController.getProductById);
// router.get("/slug/:slug", productController.getProductBySlug);

router.put(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  upload.array("images", 10),
  productController.updateProduct
);

router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  upload.array("images", 10),
  productController.createProduct
);
router.post(
  "/bulk",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  upload.single("file"),
  productController.bulkCreateProducts
);

router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  productController.deleteProduct
);

export default router;
