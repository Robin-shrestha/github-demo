// A ref like ref: "Course" is resolved by model name at query time, so every
// model has to be registered before a populate can find it. Importing models
// from here rather than one by one runs all four.
export * from "./Course.ts";
export * from "./Mark.ts";
export * from "./Student.ts";
export * from "./Teacher.ts";
export * from "./User.ts";
export * from "./Role.ts";
