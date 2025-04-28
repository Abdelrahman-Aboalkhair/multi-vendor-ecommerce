import prisma from "@/infra/database/database.config";
import { CartRepository } from "@/modules/cart/cart.repository";
import { CartService } from "@/modules/cart/cart.service";
import { cookieOptions } from "@/shared/constants";
import passport from "passport";
import { generateAccessToken, generateRefreshToken } from "./tokenUtils";

const cartRepo = new CartRepository();
const cartService = new CartService(cartRepo);

type OAuthProvider = "googleId" | "facebookId" | "twitterId";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface OAuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
  [key: string]: any;
}

async function findOrCreateUser(
  providerIdField: OAuthProvider,
  providerId: string,
  email: string,
  name: string,
  avatar: string
): Promise<OAuthUser> {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    if (!user[providerIdField]) {
      user = await prisma.user.update({
        where: { email },
        data: {
          [providerIdField]: providerId,
          avatar,
          emailVerified: true,
        },
      });
    }
    return user;
  }

  return prisma.user.create({
    data: {
      email,
      name,
      [providerIdField]: providerId,
      emailVerified: true,
      avatar,
    },
  });
}

function normalizeProfile(provider: OAuthProvider, profile: any): any {
  switch (provider) {
    case "googleId":
      return {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0]?.value || null,
      };
    case "facebookId":
      return {
        id: profile.id,
        email: profile.emails[0]?.value || "",
        name: `${profile.name?.givenName} ${profile.name?.familyName}`.trim(),
        avatar: profile.photos?.[0]?.value || null,
      };
    case "twitterId":
      return {
        id: profile.id,
        email: profile.emails?.[0]?.value || "",
        name: profile.displayName || profile.username || "",
        avatar: profile.photos?.[0]?.value || null,
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export const oauthCallback = async (
  providerIdField: OAuthProvider,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: (error: any, user?: any) => void
) => {
  try {
    const { id, email, name, avatar } = normalizeProfile(
      providerIdField,
      profile
    );
    const user = await findOrCreateUser(
      providerIdField,
      id,
      email,
      name,
      avatar
    );

    if (!user) {
      return done(new Error("Failed to create or find user"));
    }

    const userId = user.id;
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    return done(null, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return done(error);
  }
};

export const handleSocialLogin = (provider: string) => {
  const scopes =
    provider === "google"
      ? ["email", "profile"]
      : provider === "facebook"
      ? ["email", "public_profile"]
      : [];

  return passport.authenticate(provider, {
    session: false,
    scope: scopes,
  });
};

export const handleSocialLoginCallback = (provider: string) => {
  return [
    passport.authenticate(provider, {
      session: false,
      failureRedirect: "http://localhost:3000/sign-in",
    }),
    async (req: any, res: any) => {
      const { user, accessToken, refreshToken } = req.user;

      res.cookie("refreshToken", refreshToken, cookieOptions);

      const userId = user.id;
      const sessionId = req.session?.id;
      if (sessionId) {
        await cartService?.mergeCartsOnLogin(sessionId, userId);
      }

      res.redirect("http://localhost:3000");
    },
  ];
};
