import { Router } from "express";
import { makeVendorController } from "./vendor.factory";

const router = Router();
const controller = makeVendorController();

// Vendor Routes
router.get("/", controller.getAllVendors);
router.get("/me", controller.getMyVendor);
router.get("/slug/:slug", controller.getVendorBySlug);
router.get("/:id", controller.getVendorById);

router.post("/", controller.createVendor);
router.patch("/:id", controller.updateVendor);
router.patch("/:id/status", controller.updateVendorStatus);
router.delete("/:id", controller.deleteVendor);

export default router;
