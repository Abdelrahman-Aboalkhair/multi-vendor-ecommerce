import { PrismaClient, VENDOR_STATUS } from "@prisma/client";

interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  contact?: string | null;
  status: VENDOR_STATUS;
  createdAt: Date;
  updatedAt: Date;
}

export class VendorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string) {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.vendor.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.vendor.findUnique({
      where: { slug },
      include: { user: true },
    });
  }

  async findByStoreName(storeName: string) {
    return this.prisma.vendor.findUnique({
      where: { storeName },
      include: { user: true },
    });
  }

  async create(data: any) {
    return this.prisma.vendor.create({
      data,
      include: { user: true },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Vendor, "id" | "createdAt" | "updatedAt">>
  ) {
    return this.prisma.vendor.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async findAll(status?: VENDOR_STATUS, skip?: number, take?: number) {
    return this.prisma.vendor.findMany({
      where: { status },
      include: { user: true },
      skip,
      take,
    });
  }

  async delete(id: string) {
    return this.prisma.vendor.delete({ where: { id } });
  }

  async count(status?: VENDOR_STATUS) {
    return this.prisma.vendor.count({ where: { status } });
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
