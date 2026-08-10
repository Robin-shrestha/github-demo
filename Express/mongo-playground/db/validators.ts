export const COLLECTION_NAMES = ["teachers", "courses", "students", "marks"];

export const validators: Record<string, object> = {
  teachers: {
    bsonType: "object",
    required: ["name", "email", "department"],
    properties: {
      name: { bsonType: "string" },
      email: { bsonType: "string" },
      department: { bsonType: "string" },
    },
  },

  courses: {
    bsonType: "object",
    required: ["title", "code", "credits", "teacher"],
    properties: {
      title: { bsonType: "string" },
      code: { bsonType: "string" },
      credits: { bsonType: "number", minimum: 1, maximum: 6 },
      isActive: { bsonType: "bool" },
      teacher: { bsonType: "objectId" },
    },
  },

  students: {
    bsonType: "object",
    required: ["name", "role"],
    properties: {
      name: { bsonType: "string" },
      role: { bsonType: "string", enum: ["Frontend", "Backend", "Fullstack", "QA", "DevOps"] },
      avatar: { bsonType: "string" },
      courses: { bsonType: "array", items: { bsonType: "objectId" } },
    },
  },

  marks: {
    bsonType: "object",
    required: ["student", "course", "assessment", "score", "maxScore"],
    properties: {
      student: { bsonType: "objectId" },
      course: { bsonType: "objectId" },
      assessment: { bsonType: "string", enum: ["quiz", "assignment", "midterm", "final"] },
      score: { bsonType: "number", minimum: 0 },
      maxScore: { bsonType: "number", minimum: 1 },
      gradedAt: { bsonType: "date" },
    },
  },
};
