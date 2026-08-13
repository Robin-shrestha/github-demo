import { CourseModel, MarkModel, StudentModel, TeacherModel } from "../models/index.ts";

export function findStudents(role?: string) {
  const filter = role ? { role } : {};

  // return CourseModel.findOne()
  //   .populate({ path: "teacher" })
  //   .populate({ path: "students", select: "name -courses" });
  return StudentModel.find(filter).populate({ path: "courses", select: "title code" });
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
    MarkModel.find({ student: id }, { createdAt: false, updatedAt: false, gradedAt: false })
      .populate("course", "title code")
      .sort({ gradedAt: 1 }),
  ]);

  if (!student) {
    return null;
  }

  return { ...student.toJSON(), marks };
}
