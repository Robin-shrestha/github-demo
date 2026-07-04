// Higher-Order Functions

const products = [
  { name: "Keyboard", price: 10, inStock: true },
  { name: "Monitor", price: 20, inStock: false },
  { name: "Mouse", price: 25, inStock: true },
  { name: "Webcam", price: 60, inStock: true },
];

let total = 0;
const output = [];
for (let i = 0; i < products.length; i++) {
  // console.log(products[i]);
  const prod = products[i];
  total += prod.price;

  // if (prod.inStock) {
  //   output.push(prod.name);
  // }
}

products.forEach((item) => {
  console.log(item);
});

const inStockNames = products.filter((p) => p.inStock).map((p) => p.name);

const totalPrice = products.reduce((total, curr) => {
  console.log(total, curr);
  return total + curr.price;
}, 0);

const combineName = products.reduce((total, curr) => {
  console.log(total, curr);
  // return total + curr.price;

  return [...total, curr.name];
}, []);

products.forEach((p) => console.log(`${p.name}: $${p.price}`));

console.log(inStockNames);
console.log(totalPrice);
