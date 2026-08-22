import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const message = "hello";
const key = randomBytes(32); // the secret; losing it means losing the data
const iv = randomBytes(16); // random per message, not secret, just has to be unique

const cipher = createCipheriv("aes-256-cbc", key, iv);
const encrypted = Buffer.concat([cipher.update(message, "utf8"), cipher.final()]);

const decipher = createDecipheriv("aes-256-cbc", key, iv);
const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");

console.log("original  :", message);
console.log("encrypted :", encrypted.toString("base64"));
console.log("decrypted :", decrypted);
