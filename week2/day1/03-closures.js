// Closures

function createCounter() {
  let count = 0;

  return function (cond) {
    if (!cond) {
      count += 1;
    }
    return count;
  };
}

const counterA = createCounter();
const counterB = createCounter();

console.log(counterA(cond));
console.log(counterA());
console.log(counterB());

function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit: (amount) => (balance += amount),
    withdraw: (amount) => (balance -= amount),
    getBalance: () => balance,
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.withdraw(20);
console.log(account.getBalance());

const reecurssion = (limit, cb) => {
  console.log("🚀 ~ reecurssion ~ limit:", limit);
  cb();
  if (limit > 0) {
    reecurssion(limit - 1, cb);
  }
};
reecurssion(10, () => console.log("hello"));
