const message = "hello";

const encodingType: BufferEncoding = "base64";
const encoded = Buffer.from(message).toString(encodingType);
const decoded = Buffer.from(encoded, encodingType).toString();

console.log("original :", message);
console.log("encoded  :", encoded);
console.log("decoded  :", decoded);
