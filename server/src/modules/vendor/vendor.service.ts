import AppError from "@/shared/errors/AppError";
import { VendorRepository } from "./vendor.repository";
import { VENDOR_STATUS } from "@prisma/client";
import slugify from "@/shared/utils/slugify";

export class VendorService {
  constructor(private vendorRepository: VendorRepository) {}

  async getAllVendors(status?: VENDOR_STATUS, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [vendors, total] = await Promise.all([
      this.vendorRepository.findAll(status, skip, limit),
      this.vendorRepository.count(status),
    ]);
    return { vendors, total, page, limit };
  }

  async getVendorById(id: string) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }
    return vendor;
  }

  async getVendorByUserId(userId: string) {
    const vendor = await this.vendorRepository.findByUserId(userId);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }
    return vendor;
  }

  async getVendorBySlug(slug: string) {
    const vendor = await this.vendorRepository.findBySlug(slug);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }
    return vendor;
  }

  async createVendor(data: {
    userId: string;
    storeName: string;
    description?: string;
    logo?: string;
    contact?: string;
  }) {
    const existingVendor = await this.vendorRepository.findByUserId(
      data.userId
    );
    if (existingVendor) {
      throw new AppError(400, "User is already associated with a vendor");
    }

    const existingStore = await this.vendorRepository.findByStoreName(
      data.storeName
    );
    if (existingStore) {
      throw new AppError(400, "Store name is already taken");
    }

    const slug = slugify(data.storeName);
    const existingSlug = await this.vendorRepository.findBySlug(slug);
    if (existingSlug) {
      throw new AppError(400, "Generated slug is already in use");
    }

    return await this.vendorRepository.create({
      ...data,
      slug,
      status: VENDOR_STATUS.PENDING,
    });
  }

  async updateVendor(
    id: string,
    data: Partial<{
      storeName: string;
      slug: string;
      description: string | null;
      logo: string | null;
      contact: string | null;
      status: VENDOR_STATUS;
    }>
  ) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }

    if (data.storeName) {
      const existingStore = await this.vendorRepository.findByStoreName(
        data.storeName
      );
      if (existingStore && existingStore.id !== id) {
        throw new AppError(400, "Store name is already taken");
      }
      data.slug = slugify(data.storeName);
      const existingSlug = await this.vendorRepository.findBySlug(data.slug);
      if (existingSlug && existingSlug.id !== id) {
        throw new AppError(400, "Generated slug is already in use");
      }
    }

    return await this.vendorRepository.update(id, data);
  }

  async updateVendorStatus(id: string, status: VENDOR_STATUS) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }
    return await this.vendorRepository.update(id, { status });
  }

  async deleteVendor(id: string) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new AppError(404, "Vendor not found");
    }
    await this.vendorRepository.delete(id);
  }
}
