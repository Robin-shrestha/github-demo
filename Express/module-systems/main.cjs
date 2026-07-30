// CommonJS: require() to bring in, module.exports to send out.
const { add, PI } = require("./math.cjs");

console.log("CommonJS");
console.log("add(2, 3) =", add(2, 3));
console.log("PI =", PI);
