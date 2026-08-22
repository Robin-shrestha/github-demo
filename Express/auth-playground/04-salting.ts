import { createHash, randomBytes } from "node:crypto";

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const password = "password123";

console.log("no salt, user A :", hash(password));
console.log("no salt, user B :", hash(password)); // identical, same password

const saltA = "saltA";
const saltB = randomBytes(8).toString("hex");

console.log("salted, user A  :", hash(password + saltA));
console.log("salted, user B  :", hash(password + saltB)); // different, same password

// bcrypt does this automatically: it generates a salt, hashes with it, and
// stores the salt as part of the result string, so nothing here has to be
// managed by hand.
