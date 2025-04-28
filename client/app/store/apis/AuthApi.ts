import { User } from "@/app/types/authTypes";
import { apiSlice } from "../slices/ApiSlice";
import { clearAuthState, setAccessToken, setUser } from "../slices/AuthSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { user: User; accessToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data from sign in => ", data);
          dispatch(setAccessToken(data.accessToken));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    signup: builder.mutation<{ user: User; accessToken: string }, FormData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data from sign in => ", data);
          dispatch(setAccessToken(data.accessToken));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error("Login failed:", error);
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuthState());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    refresh: builder.mutation<{ user: User; accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST", // Changed to POST
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error("error refreshing token => ", error); // Also changed to console.error
          dispatch(clearAuthState());
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

    checkAuth: builder.mutation<{ user: User; accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data from check auth =>", data);
          dispatch(setAccessToken(data.accessToken));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error("error checking auth =>", error);
          dispatch(clearAuthState());
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useCheckAuthMutation,
  useRefreshMutation,
  useSignOutMutation,
  useApplyForVendorMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
