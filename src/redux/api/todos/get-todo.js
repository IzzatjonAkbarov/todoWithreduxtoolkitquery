import { api } from "../index"; // Asosiy api faylini import qilish

// Todos uchun endpointlar
export const todosApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTodosApi: build.query({
      query: () => ({
        url: "currency",
      }),
      providesTags: ["TODO"],
    }),
    postToTheApi: build.mutation({
      query: (postingData) => ({
        url: "currency",
        method: "POST",
        body: postingData,
      }),
      invalidatesTags: ["TODO"],
    }),

    deleteFromApi: build.mutation({
      query: ({ id }) => ({
        url: `currency/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TODO"],
    }),

    editTheDataOnTHEApi: build.mutation({
      query: (dataForEdit) => ({
        url: `currency/${dataForEdit.id}`,
        method: "PUT",
        body: dataForEdit,
      }),
      invalidatesTags: ["TODO"],
    }),
  }),
});

export const {
  useGetTodosApiQuery,
  usePostToTheApiMutation,
  useDeleteFromApiMutation,
  useEditTheDataOnTHEApiMutation,
} = todosApi;
