import { randomUUID } from "node:crypto";
import type { StudentInput } from "../models/Student.ts";

type StoredStudent = StudentInput & { id: number | string };
/**
 *
 * This data service is just for the vanilla server demo
 */

let students: StoredStudent[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend",
    email: "aarav@lf.edu",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Priya Thapa",
    role: "Backend",
    email: "priya@lf.edu",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Bikash Rai",
    role: "Fullstack",
    email: "bikash@lf.edu",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 4,
    name: "Sita Gurung",
    role: "Frontend",
    email: "sita@lf.edu",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 5,
    name: "Rohan KC",
    role: "Backend",
    email: "rohan@lf.edu",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

export function listStudents(): StoredStudent[] {
  return students;
}

export function findStudent(id: string): StoredStudent | undefined {
  return students.find((student) => String(student.id) === id);
}

export function addStudent(input: StudentInput): StoredStudent {
  const student: StoredStudent = { id: randomUUID(), ...input };
  students.push(student);
  return student;
}

export function updateStudent(id: string, input: StudentInput): StoredStudent | undefined {
  const student = findStudent(id);
  if (!student) return undefined;

  student.name = input.name;
  student.role = input.role;
  student.email = input.email;
  student.avatar = input.avatar;
  return student;
}

export function deleteStudent(id: string): boolean {
  const before = students.length;
  students = students.filter((student) => String(student.id) !== id);
  return students.length < before;
}
