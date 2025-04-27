import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CartService } from "../cart/cart.service";
import { VendorRepository } from "../vendor/vendor.repository";
import { CartRepository } from "../cart/cart.repository";

export const makeAuthController = () => {
  const authRepository = new AuthRepository();
  const vendorRepository = new VendorRepository();
  const cartRepo = new CartRepository();
  const cartService = new CartService(cartRepo);
  const service = new AuthService(authRepository, vendorRepository);
  return new AuthController(service, cartService);
};
