import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAccessToken, setAccessToken } from "./AuthSlice";

interface RefreshTokenResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data: RefreshTokenResponse = refreshResult.data;
      // Update access token
      api.dispatch(setAccessToken(data.accessToken));
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear token and redirect to login
      api.dispatch(clearAccessToken());
      window.location.href = "/sign-in";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Product",
    "Category",
    "Cart",
    "Order",
    "Review",
    "Section",
    "Transactions",
    "Logs",
  ],
  endpoints: () => ({}),
});
