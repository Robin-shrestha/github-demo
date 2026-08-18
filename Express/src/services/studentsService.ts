import { MarkModel, StudentModel, type Role } from "../models/index.ts";
import type { CreateStudentInput, PatchStudentInput } from "../validation/studentSchemas.ts";

interface ListOptions {
  role?: Role;
  page: number;
  limit: number;
}

export function findStudents({ role, page, limit }: ListOptions) {
  const filter = role ? { role } : {};

  return StudentModel.find(filter)
    .populate("courses", "title code")
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function findStudentById(id: string) {
  // Marks live in their own collection and hold the reference, so populate
  // cannot reach them from a student. They need a second query.
  const [student, marks] = await Promise.all([
    StudentModel.findById(id).populate({
      path: "courses",
      select: "title code credits",
      populate: { path: "teacher", select: "name department" },
    }),
    MarkModel.find({ student: id }).populate("course", "title code").sort({ gradedAt: 1 }),
  ]);

  if (!student) {
    return null;
  }

  return { ...student.toJSON(), marks };
}

export function createStudent(input: CreateStudentInput) {
  return StudentModel.create(input);
}

export function updateStudent(id: string, changes: CreateStudentInput | PatchStudentInput) {
  return StudentModel.findByIdAndUpdate(id, changes, {
    returnDocument: "after",
    // Without this the schema rules a create would enforce are skipped.
    runValidators: true,
  });
}

export function removeStudent(id: string) {
  return StudentModel.findByIdAndDelete(id);
}

export function updateStudentAvatar(id: string, avatar: string) {
  return StudentModel.findByIdAndUpdate(id, { avatar }, { returnDocument: "after" });
}
