import { createHash } from "node:crypto";

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

console.log("hash('hello')       :", hash("hello"));
console.log("hash('hello') again :", hash("hello")); // identical every time
console.log("hash('Hello')       :", hash("Hello")); // one letter changes everything
