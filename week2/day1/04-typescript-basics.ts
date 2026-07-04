// TypeScript Basics

let username: string = "Aarav";
let age: number = 24;
let isEnrolled: boolean = true;
let skills: string[] = ["HTML", "CSS", "JavaScript"];

function add(a: number, b: number): number {
  return a + b;
}

interface Student {
  name: string;
  track: string;
  // age?: number;
  age: number | undefined;
}

const student: Student = {
  name: "Priya",
  track: "Backend",
  age: undefined,
};

type Point = { x: number; y: number };

function printStudent(s: Student): void {
  console.log(s.name, s.track);
}

printStudent(student);

interface Test {
  x: number;
}
interface Test {
  y: number;
}

const z: Test = { x: 1, y: 2 };

// Generics

function identity<T>(value: T): T {
  return value;
}
type x = "TEST";

const test = identity("test");
const number = identity<number>(1);

function getFirst<T, Y>(items: T[], arg: Y): T {
  return items[0];
}

interface Box<T> {
  content: T;
}

const numberBox: Box<number> = { content: 42 };
const stringBox: Box<string> = { content: "hello" };

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);

// Common TS Utility Types

interface Course {
  title: string;
  weeks: number;
  instructor: string;
}

type PartialCourse = Partial<Course>;
type ReadonlyCourse = Readonly<Course>;

const course: ReadonlyCourse = {
  instructor: "test",
  title: "test",
  weeks: 1,
};

type CourseTitleOnly = Pick<Course, "title" | "weeks">;
type CourseWithoutInstructor = Omit<Course, "instructor">;

const courseOmit: CourseWithoutInstructor = {
  title: "test",
  weeks: 1,
};

courseOmit.weeks = 2;

type CourseRecord = Record<string, Course>;

const rec: CourseRecord = {
  rec1: course,
  rec2: course,
  rec3: course,
};
type RequiredCourse = Required<PartialCourse>;

const draftCourse: PartialCourse = { title: "JS Fundamentals" };

const lockedCourse: ReadonlyCourse = {
  title: "React",
  weeks: 3,
  instructor: "Robin",
};

const courseCatalog: CourseRecord = {
  js: { title: "JS Fundamentals", weeks: 1, instructor: "Robin" },
};
