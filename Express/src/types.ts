export interface Student {
  id: number | string;
  name: string;
  role: string;
  avatar: string;
}

export type NewStudent = Omit<Student, "id">;
