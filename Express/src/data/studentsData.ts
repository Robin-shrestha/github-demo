import { randomUUID } from "node:crypto";
import type { Student } from "../types/studentTypes.ts";

type StoredStudent = Student & { id: number | string };

let students: StoredStudent[] = [
  { id: 1, name: "Aarav Sharma", role: "Frontend", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Priya Thapa", role: "Backend", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Bikash Rai", role: "Fullstack", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 4, name: "Sita Gurung", role: "Frontend", avatar: "https://i.pravatar.cc/150?img=20" },
  { id: 5, name: "Rohan KC", role: "Backend", avatar: "https://i.pravatar.cc/150?img=32" },
];

export function listStudents(): StoredStudent[] {
  return students;
}

export function findStudent(id: string): StoredStudent | undefined {
  return students.find((student) => String(student.id) === id);
}

export function addStudent(input: Student): StoredStudent {
  const student: StoredStudent = { id: randomUUID(), ...input };
  students.push(student);
  return student;
}

export function updateStudent(id: string, input: Student): StoredStudent | undefined {
  const student = findStudent(id);
  if (!student) return undefined;

  student.name = input.name;
  student.role = input.role;
  student.avatar = input.avatar;
  return student;
}

export function deleteStudent(id: string): boolean {
  const before = students.length;
  students = students.filter((student) => String(student.id) !== id);
  return students.length < before;
}
