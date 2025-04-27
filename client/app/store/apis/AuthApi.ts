import { User } from "@/app/types/authTypes";
import { apiSlice } from "../slices/ApiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { user: User; success: boolean },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Clear logout flag on successful sign-in
          localStorage.removeItem("isLoggedOut");
        } catch (error) {
          console.error("Sign-in failed:", error);
        }
      },
    }),
    signup: builder.mutation<{ user: User; success: boolean }, FormData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Clear logout flag on successful signup
          localStorage.removeItem("isLoggedOut");
        } catch (error) {
          console.error("Signup failed:", error);
        }
      },
    }),

    applyForVendor: builder.mutation<
      { vendor: any },
      {
        storeName: string;
        description?: string;
        contact?: string;
        businessDetails?: {
          taxId?: string;
          businessLicense?: string;
          otherDocuments?: string[];
        };
        logoFiles?: File[];
      }
    >({
      query: (data) => ({
        url: "/auth/apply-for-vendor",
        method: "POST",
        body: data,
      }),
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/sign-out",
        method: "GET",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Set logout flag on successful sign-out
          localStorage.setItem("isLoggedOut", "true");
        } catch (error) {
          console.error("Sign-out failed:", error);
        }
      },
    }),
    verifyEmail: builder.mutation<void, { emailVerificationCode: string }>({
      query: ({ emailVerificationCode }) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: { emailVerificationCode },
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { newPassword, token },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useSignOutMutation,
  useApplyForVendorMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
