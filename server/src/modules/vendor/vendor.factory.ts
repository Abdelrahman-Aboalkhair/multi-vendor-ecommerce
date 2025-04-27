import { VendorController } from "./vendor.controller";
import { VendorRepository } from "./vendor.repository";
import { VendorService } from "./vendor.service";

export const makeVendorController = () => {
  const repository = new VendorRepository();
  const service = new VendorService(repository);
  return new VendorController(service);
};
