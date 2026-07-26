import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../api/endpoints";
import { studentRequests } from "../api/studentRequests";
import type { Student } from "../types/types";

export const studentsApi = createApi({
  reducerPath: "studentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Student"],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: studentRequests.list,
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: "Student" as const, id: String(s.id) })),
              { type: "Student" as const, id: "LIST" },
            ]
          : [{ type: "Student" as const, id: "LIST" }],
    }),
    getStudentById: builder.query<Student, string>({
      query: studentRequests.byId,
      providesTags: (_result, _error, id) => [{ type: "Student", id }],
    }),
    addStudent: builder.mutation<Student, Omit<Student, "id">>({
      query: studentRequests.create,
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),
    deleteStudent: builder.mutation<unknown, Student["id"]>({
      query: studentRequests.remove,
      invalidatesTags: (_result, _error, id) => [
        { type: "Student", id: String(id) },
        { type: "Student", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
