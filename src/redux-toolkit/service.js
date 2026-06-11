import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../utils/cookies";

export const avidusApi = createApi({
  reducerPath: "avidusApi",
  tagTypes: ["Users", "Activity", "Tasks"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getCookie("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    login: builder.mutation({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    fetchAllUsers: builder.query({
      query: () => "/user/users",
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    updateUserStatus: builder.mutation({
      query: (user) => ({
        url: `/user/update/${user._id || user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    fetchActivityLogs: builder.query({
      query: () => "/activity/all",
      providesTags: ["Activity"],
    }),

    fetchAllTasks: builder.query({
      query: () => "/task/all-task",
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/task/create-task",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),

    fetchTaskById: builder.query({
      query: (id) => `/task/task-user/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tasks", id }],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...taskData }) => ({
        url: `/task/update-task/${id}`,
        method: "PUT",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/delete-task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    fetchProducts: builder.query({
      query: () => "/products",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useFetchProductsQuery,
  useFetchAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useFetchActivityLogsQuery,
  useFetchAllTasksQuery,
  useCreateTaskMutation,
  useFetchTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = avidusApi;
