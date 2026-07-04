// Destructuring & Spread/Rest

const user = {
  name: "Aarav",
  role: "Frontend",
  track: { level: "Beginner", cohort: 2026 },
};

const { name, ...rest } = user;

const {
  name,
  role,
  track: { level },
} = user;

const numbers = [1, 2, 3];
const [one, ...others] = numbers;
const moreNumbers = [...numbers, 4, 5];

const defaults = { theme: "dark", fontSize: 14 };
const overrides = { fontSize: 16 };
const settings = { ...defaults, ...overrides };

function sum(...values) {
  return values.reduce((total, n) => total + n, 0);
}

console.log(name, role, level);
console.log(moreNumbers);
console.log(settings);
console.log(sum(1, 2, 3, 4));

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

const user1 = {
  name: "Aarav",
  role: "Frontend",
  track: { level: "Beginner", cohort: 2026 },
};

const additionalDetail = {
  name: "TEST",
  college: "KEC",
};

const combinedObj = { ...user1, ...additionalDetail };
