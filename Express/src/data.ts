import { randomUUID } from "node:crypto";
import type { NewStudent, Student } from "./types.ts";

let students: Student[] = [
  { id: 1, name: "Aarav Sharma", role: "Frontend", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Priya Thapa", role: "Backend", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Bikash Rai", role: "Fullstack", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 4, name: "Sita Gurung", role: "Frontend", avatar: "https://i.pravatar.cc/150?img=20" },
  { id: 5, name: "Rohan KC", role: "Backend", avatar: "https://i.pravatar.cc/150?img=32" },
];

export function listStudents(): Student[] {
  return students;
}

export function findStudent(id: string): Student | undefined {
  return students.find((student) => String(student.id) === id);
}

export function addStudent(input: NewStudent): Student {
  const student: Student = { id: randomUUID(), ...input };
  students.push(student);
  return student;
}

export function updateStudent(id: string, input: NewStudent): Student | undefined {
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
