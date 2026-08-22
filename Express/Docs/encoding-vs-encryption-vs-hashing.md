# Encoding vs Encryption vs Hashing

Three different operations that all turn data into a different shape. Only one of them is
right for a password.

## Encoding

Changes the format of data so it can be handled by a system that only expects certain
characters. Base64 is the common example, and it's fully reversible with no key at all:

```js
const encoded = Buffer.from("hello").toString("base64"); // "aGVsbG8="
const decoded = Buffer.from(encoded, "base64").toString(); // "hello"
```

Anyone can decode it. It gives no protection, and it isn't for secrets.

**Used for:** getting data through a system that would otherwise break on it, not for keeping
it secret. A JWT is base64 encoded, not encrypted, so its payload can be read by anyone.
Embedding an image directly in a CSS file or HTML page as a data URL works the same way.
Attaching a file to an email relies on it too, since email was built for text. The problem it
solves is compatibility, moving data through a text-only channel intact, and nothing else.

## Encryption

Scrambles data so it can only be read again with the right key:

```js
const encrypted = encrypt(message, secretKey);
const original = decrypt(encrypted, secretKey); // works, with the same key
```

It's reversible on purpose, useful for data that needs to be read again later, like a card
number a payment provider needs to charge. It's the wrong choice for a password, because a
stolen key or a bug turns every stored password readable at once.

**Used for:** any data that has to come back out in its original form eventually. A database
column holding a customer's card details or a document with medical records gets encrypted at
rest, so a stolen backup or a compromised disk is just unreadable noise without the key. Traffic
between a browser and a server is encrypted in transit (HTTPS) so anyone listening on the
network sees nothing usable. The problem it solves is keeping data private while still able to
be recovered by whoever is supposed to have it.

## Hashing

Turns data into a fixed-length value with no way back. The same input always produces the
same output, but no operation turns the output back into the input:

```js
const hash = sha256("hello"); // always the same value, no reverse function exists
```

A password only ever needs to be checked, never read back. Signup hashes the password and
stores the hash. Login hashes whatever was typed and compares the two hashes. The actual
password is never stored anywhere.

**Used for:** anything that only needs to be verified, not read back. Passwords are the main
example, but it's the same idea behind checking a downloaded file hasn't been corrupted or
tampered with (comparing its hash against the one the publisher posted), or detecting duplicate
files without comparing their full contents. The problem it solves is proving something matches
without ever needing to store or expose the original value at all.
