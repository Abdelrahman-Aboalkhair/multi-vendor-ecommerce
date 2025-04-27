import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieOptions } from "@/shared/constants";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { AuthService } from "./auth.service";
import { tokenUtils } from "@/shared/utils/authUtils";
import AppError from "@/shared/errors/AppError";
import { CartService } from "../cart/cart.service";
import { makeLogsService } from "../logs/logs.factory";

const { maxAge, ...clearCookieOptions } = cookieOptions;

export class AuthController {
  private logsService = makeLogsService();
  constructor(
    private authService: AuthService,
    private cartService?: CartService
  ) {}

  register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const start = Date.now();
      const { name, email, password, role } = req.body;
      const { user, accessToken, refreshToken } =
        await this.authService.registerUser({
          name,
          email,
          password,
          role,
        });

      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.cookie("accessToken", accessToken, cookieOptions);

      const userId = user.id;
      const sessionId = req.session.id;

      await this.cartService?.mergeCartsOnLogin(sessionId, userId);

      sendResponse(res, 201, {
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            avatar: user.avatar || null,
          },
        },
      });
      this.logsService.info("Register", {
        userId,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  getVerificationEmail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.params;
      const userId = req.user?.id;
      const result = await this.authService.sendVerificationEmail(email);
      sendResponse(res, 200, { message: result.message });

      const start = Date.now();
      this.logsService.info("Send Verification Email", {
        userId,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { emailVerificationToken } = req.body;
      const result = await this.authService.verifyEmail(emailVerificationToken);
      const userId = req.user?.id;

      sendResponse(res, 200, { message: result.message });

      const start = Date.now();
      this.logsService.info("Verify Email", {
        userId,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.authService.signin({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    const userId = user.id;
    const sessionId = req.session.id;
    await this.cartService?.mergeCartsOnLogin(sessionId, userId);

    sendResponse(res, 200, {
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
      },
      message: "User logged in successfully",
    });

    const start = Date.now();
    this.logsService.info("Sign in", {
      userId,
      sessionId: req.session.id,
      timePeriod: Date.now() - start,
    });
  });

  signout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req?.cookies?.refreshToken;
    const accessToken = req?.cookies?.accessToken;
    const userId = req.user?.id;

    if (refreshToken) {
      const decoded: any = jwt.decode(refreshToken);
      if (decoded && decoded.absExp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.absExp - now;
        if (ttl > 0) {
          await tokenUtils.blacklistToken(refreshToken, ttl);
        }
      }
    }

    if (accessToken) {
      const decoded: any = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;
        if (ttl > 0) {
          await tokenUtils.blacklistToken(accessToken, ttl);
        }
      }
    }

    res.clearCookie("refreshToken", clearCookieOptions);
    res.clearCookie("accessToken", clearCookieOptions);

    sendResponse(res, 200, { message: "Logged out successfully" });
    const start = Date.now();
    this.logsService.info("Sign out", {
      userId,
      sessionId: req.session.id,
      timePeriod: Date.now() - start,
    });
  });

  forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const response = await this.authService.forgotPassword(email);
      const userId = req.user?.id;

      sendResponse(res, 200, { message: response.message });
      const start = Date.now();
      this.logsService.info("Forgot Password", {
        userId,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { token, newPassword } = req.body;
      const response = await this.authService.resetPassword(token, newPassword);
      const userId = req.user?.id;

      sendResponse(res, 200, { message: response.message });
      const start = Date.now();
      this.logsService.info("Reset Password", {
        userId,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const oldRefreshToken = req?.cookies?.refreshToken;

      if (!oldRefreshToken) {
        throw new AppError(401, "Refresh token not found");
      }

      const { newAccessToken, newRefreshToken, user } =
        await this.authService.refreshToken(oldRefreshToken);

      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      res.cookie("accessToken", newAccessToken, cookieOptions);

      sendResponse(res, 200, {
        message: "Token refreshed successfully",
        data: {
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
      const start = Date.now();
      this.logsService.info("Refresh Token", {
        userId: req.user?.id,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );

  applyForVendor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      console.log("req.body => ", req.body);
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, "User not authenticated");
      }

      const vendorData = req.body;
      const vendor = await this.authService.applyForVendor(userId, vendorData);

      sendResponse(res, 201, {
        message: "Vendor application submitted successfully",
        data: { vendor },
      });

      const start = Date.now();
      this.logsService.info("Vendor Application", {
        userId,
        sessionId: req.session.id,
        timePeriod: Date.now() - start,
      });
    }
  );
}
