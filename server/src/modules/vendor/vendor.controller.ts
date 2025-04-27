import { Request, Response } from "express";
import { VendorService } from "./vendor.service";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { makeLogsService } from "../logs/logs.factory";
import { VENDOR_STATUS } from "@prisma/client";

export class VendorController {
  private logsService = makeLogsService();
  constructor(private vendorService: VendorService) {}

  getAllVendors = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { status, page = "1", limit = "10" } = req.query;

      const vendors = await this.vendorService.getAllVendors(
        status as VENDOR_STATUS | undefined,
        parseInt(page as string),
        parseInt(limit as string)
      );
      sendResponse(res, 200, {
        data: { vendors },
        message: "Vendors fetched successfully",
      });
    }
  );

  getVendorById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const vendor = await this.vendorService.getVendorById(id);
      sendResponse(res, 200, {
        data: { vendor },
        message: "Vendor fetched successfully",
      });
    }
  );

  getVendorBySlug = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { slug } = req.params;
      const vendor = await this.vendorService.getVendorBySlug(slug);
      sendResponse(res, 200, {
        data: { vendor },
        message: "Vendor fetched successfully",
      });
    }
  );

  getMyVendor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }
      const vendor = await this.vendorService.getVendorByUserId(userId);
      sendResponse(res, 200, {
        data: { vendor },
        message: "Vendor fetched successfully",
      });
    }
  );

  createVendor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }
      const vendorData = { ...req.body, userId };
      const vendor = await this.vendorService.createVendor(vendorData);
      sendResponse(res, 201, {
        data: { vendor },
        message: "Vendor created successfully",
      });
      const start = Date.now();
      const end = Date.now();
      this.logsService.info("Vendor created", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );

  updateVendor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updatedData = req.body;
      const vendor = await this.vendorService.updateVendor(id, updatedData);
      sendResponse(res, 200, {
        data: { vendor },
        message: "Vendor updated successfully",
      });
      const start = Date.now();
      const end = Date.now();
      this.logsService.info("Vendor updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );

  updateVendorStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;
      const vendor = await this.vendorService.updateVendorStatus(id, status);
      sendResponse(res, 200, {
        data: { vendor },
        message: "Vendor status updated successfully",
      });
      const start = Date.now();
      const end = Date.now();
      this.logsService.info("Vendor status updated", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );

  deleteVendor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await this.vendorService.deleteVendor(id);
      sendResponse(res, 204, { message: "Vendor deleted successfully" });
      const start = Date.now();
      const end = Date.now();
      this.logsService.info("Vendor deleted", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: end - start,
      });
    }
  );
}
