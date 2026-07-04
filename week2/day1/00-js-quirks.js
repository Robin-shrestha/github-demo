// Type Coercion & Common Runtime Bugs

console.log("5" + 3);
console.log("5" - 3);
console.log(5 + 3);
console.log(NaN === NaN);
console.log(typeof "5", typeof 5, typeof undefined, typeof null);

const user = { name: "Aarav", role: "Frontend" };

try {
  console.log(user.track.level);
} catch (error) {
  console.log(error.message);
}

// Optional Chaining & Nullish Coalescing

console.log(user.track?.level);
console.log(null ?? "No level set");
console.log(false ?? "No level set");
console.log(null || "No level set");
console.log(false || "No level set");

const settings = { theme: null, fontSize: 0 };
console.log(settings.theme ?? "dark");
console.log(settings.fontSize || 14);
console.log(settings.fontSize ?? 14);

// Implicit Object Shape

const products = [{ name: "Keyboard", price: 45 }, { name: "Monitor" }];

products.forEach((p) => console.log(p.name, p.price));
