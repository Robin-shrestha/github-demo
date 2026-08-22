# Password Salting

Hashing a password alone has a problem: two accounts with the same password get the same
hash, and a precomputed list of hashes for common passwords (a "rainbow table") cracks them
instantly.

A salt is random data mixed into the password before hashing, different for every account. The
same password now produces a different hash for each person, and a precomputed table stops
working:

```js
hash("password123" + saltA); // one value
hash("password123" + saltB); // a different value, same password
```

bcrypt does this automatically. Given a password, it generates a salt, hashes with it, and
stores the salt as part of the result string, so nothing extra needs to be saved by hand:

```js
const hash = await bcrypt.hash(password, 10); // 10 is the cost
const isMatch = await bcrypt.compare(typedPassword, hash);
```

The cost factor is deliberate. A fast hash is fast for an attacker too, trying millions of
guesses a second against a stolen database. bcrypt is built to be slow on purpose, and the cost
factor controls how slow.
