import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

// Asosiy soʻrovni sozlash
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Qayta urinishlar bilan soʻrov
const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

// API ni yaratish
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["TODO"],
  endpoints: () => ({}), // Boʻsh endpoints
});
