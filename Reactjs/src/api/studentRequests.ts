import { v4 as uuid } from "uuid";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { Student } from "../types/types";

export const studentRequests = {
  list: (): string => "/students",
  byId: (id: string): string => `/students/${id}`,
  create: (student: Omit<Student, "id">): FetchArgs => ({
    url: "/students",
    method: "POST",
    body: { ...student, id: uuid() },
  }),
  remove: (id: Student["id"]): FetchArgs => ({
    url: `/students/${id}`,
    method: "DELETE",
  }),
};
