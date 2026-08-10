import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { CourseModel } from "../src/models/Course.ts";
import { MarkModel } from "../src/models/Mark.ts";
import { StudentModel } from "../src/models/Student.ts";
import { TeacherModel } from "../src/models/Teacher.ts";

const force = process.argv.includes("--force");

const seedSchool = async (): Promise<void> => {
  await connectWithMongoose();

  try {
    const existing = await TeacherModel.countDocuments();

    if (existing > 0 && !force) {
      console.log("Already seeded. Run with --force to wipe and rebuild.");
      return;
    }

    await Promise.all([
      TeacherModel.deleteMany({}),
      CourseModel.deleteMany({}),
      StudentModel.deleteMany({}),
      MarkModel.deleteMany({}),
    ]);

    await Promise.all([
      TeacherModel.syncIndexes(),
      CourseModel.syncIndexes(),
      MarkModel.syncIndexes(),
    ]);

    const teachers = await TeacherModel.insertMany([
      { name: "Sunita Rai", email: "sunita.rai@lf.edu", department: "Engineering" },
      { name: "Deepak Shah", email: "deepak.shah@lf.edu", department: "Engineering" },
      { name: "Maya Gurung", email: "maya.gurung@lf.edu", department: "Design" },
    ]);

    const teacherId = new Map(teachers.map((t) => [t.email, t._id]));

    const courses = await CourseModel.insertMany([
      {
        title: "React Basics",
        code: "RB101",
        credits: 3,
        teacher: teacherId.get("sunita.rai@lf.edu"),
      },
      {
        title: "Node Fundamentals",
        code: "NF102",
        credits: 4,
        teacher: teacherId.get("deepak.shah@lf.edu"),
      },
      {
        title: "Database Design",
        code: "DD201",
        credits: 3,
        teacher: teacherId.get("deepak.shah@lf.edu"),
      },
      {
        title: "UI Foundations",
        code: "UI110",
        credits: 2,
        teacher: teacherId.get("maya.gurung@lf.edu"),
      },
    ]);

    const courseId = new Map(courses.map((c) => [c.code, c._id]));

    const enrolments: Record<string, string[]> = {
      "Priya Thapa": ["RB101", "UI110"],
      "Bikash Rai": ["RB101", "NF102", "DD201"],
      "Anjali Karki": ["RB101", "UI110"],
      "Suman Lama": ["NF102", "DD201"],
      "Rohan KC": ["NF102"],
    };

    const roles: Record<string, string> = {
      "Priya Thapa": "Frontend",
      "Bikash Rai": "Fullstack",
      "Anjali Karki": "Frontend",
      "Suman Lama": "Backend",
      "Rohan KC": "Backend",
    };

    const students = await StudentModel.insertMany(
      Object.keys(enrolments).map((name, i) => ({
        name,
        role: roles[name],
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        courses: enrolments[name].map((code) => courseId.get(code)),
      }))
    );

    const marks = students.flatMap((student, i) =>
      enrolments[student.name].flatMap((code) => {
        const base = {
          student: student._id,
          course: courseId.get(code),
          maxScore: 100,
        };

        const midterm = { ...base, assessment: "midterm", score: 60 + ((i * 7) % 35) };

        return i < 2
          ? [midterm, { ...base, assessment: "final", score: 55 + ((i * 11) % 40) }]
          : [midterm];
      })
    );

    await MarkModel.insertMany(marks);

    console.log("teachers :", await TeacherModel.countDocuments());
    console.log("courses  :", await CourseModel.countDocuments());
    console.log("students :", await StudentModel.countDocuments());
    console.log("marks    :", await MarkModel.countDocuments());
    console.log(
      "RB101 roster :",
      await StudentModel.countDocuments({ courses: courseId.get("RB101") })
    );
    console.log("midterms     :", await MarkModel.countDocuments({ assessment: "midterm" }));
  } finally {
    await disconnectMongoose();
  }
};

await seedSchool();
