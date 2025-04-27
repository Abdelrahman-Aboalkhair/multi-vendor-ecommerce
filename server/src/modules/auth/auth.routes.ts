import express from "express";
import { makeAuthController } from "./auth.factory";
import {
  handleSocialLogin,
  handleSocialLoginCallback,
} from "@/shared/utils/auth/oauthUtils";
import protect from "@/shared/middlewares/protect";
import upload from "@/shared/middlewares/upload";

const router = express.Router();
const authController = makeAuthController();

router.get("/google", handleSocialLogin("google"));
router.get("/google/callback", handleSocialLoginCallback("google"));

router.get("/facebook", handleSocialLogin("facebook"));
router.get("/facebook/callback", handleSocialLoginCallback("facebook"));

router.get("/twitter", handleSocialLogin("twitter"));
router.get("/twitter/callback", handleSocialLoginCallback("twitter"));

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.get(
  "/verification-email/:email",
  protect,
  authController.getVerificationEmail
);
router.post("/sign-in", authController.signin);
router.get("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/sign-out", protect, authController.signout);
router.post(
  "/apply-for-vendor",
  protect,
  upload.array("logoFiles", 2),
  authController.applyForVendor
);

export default router;
