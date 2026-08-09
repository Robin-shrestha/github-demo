import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";
import type { Student } from "../src/types/studentTypes.ts";

const FIRST_NAMES = [
  "Aarav",
  "Priya",
  "Bikash",
  "Sita",
  "Rohan",
  "Anjali",
  "Suman",
  "Nabin",
  "Sunita",
  "Prakash",
  "Manisha",
  "Dipesh",
  "Kritika",
  "Sanjay",
  "Bibek",
  "Sarita",
  "Niraj",
  "Puja",
  "Ramesh",
  "Alisha",
];

const LAST_NAMES = [
  "Sharma",
  "Thapa",
  "Rai",
  "Gurung",
  "KC",
  "Joshi",
  "Karki",
  "Lama",
  "Adhikari",
  "Shrestha",
];

const ROLES = ["Frontend", "Backend", "Fullstack", "QA", "DevOps"];

const STUDENT_COUNT = 100;

function buildStudents(total: number): Student[] {
  const list: Student[] = [];
  const used = new Set<string>();

  for (let i = 0; list.length < total; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const name = `${first} ${last}`;

    if (used.has(name)) continue;
    used.add(name);

    list.push({
      name,
      role: ROLES[list.length % ROLES.length],
      avatar: `https://i.pravatar.cc/150?img=${(list.length % 70) + 1}`,
    });
  }

  return list;
}

// Pass --force to wipe and reseed. The later scripts update and delete
// documents, so the data needs resetting between runs.
const force = process.argv.includes("--force");

const seedStudents = async (): Promise<void> => {
  await connectToDatabase();

  try {
    const existing = await students.countDocuments();

    if (existing > 0 && !force) {
      console.log(`${existing} students already exist. Run with --force to wipe and reseed.`);
      return;
    }

    if (existing > 0) {
      await students.deleteMany({});
      console.log(`Removed ${existing} existing students`);
    }

    const result = await students.insertMany(buildStudents(STUDENT_COUNT));
    console.log(`Seeded ${result.insertedCount} students`);

    for (const role of ROLES) {
      console.log(`  ${role.padEnd(10)} ${await students.countDocuments({ role })}`);
    }
  } finally {
    await disconnectFromDatabase();
  }
};

await seedStudents();
