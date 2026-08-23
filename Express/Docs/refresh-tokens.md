# Refresh Tokens

An access token that lasts a long time is a problem if it leaks, since it stays valid for
however long it was signed for. One that expires quickly is safer, but forces a repeated login
every time it does. A refresh token solves both at once: keep the access token short, and use a
second, longer-lived token to get a new one without asking for a password again.

## The two tokens

Login issues both. The access token goes on every request that needs to prove who's asking,
usually in an `Authorization: Bearer` header. The refresh token does one thing only: exchange
itself for a new access token at a `/refresh` endpoint, once the old one has expired.

```
POST /login          -> { accessToken, refreshToken }
GET  /items            Authorization: Bearer <accessToken>
... time passes, accessToken expires ...
POST /refresh           sends refreshToken -> { accessToken }   (a new one)
```

A client doesn't wait to refresh by hand. The usual pattern is to try the request, and if it
comes back 401, refresh once and retry it automatically. The person using the app never sees
the expiry happen.

## Where each one lives

The access token can stay wherever it already lived, a header, kept in memory. The refresh
token is worth more to steal, since it's valid for days instead of minutes, so it goes
somewhere JavaScript can't read it: an httpOnly cookie. A stolen access token is a problem for a
few minutes. A stolen refresh token sitting in the same place as the access token is a problem
for as long as it's valid.

An httpOnly cookie is set by the server and sent back automatically by the browser on every
request to that origin. Nothing in the page's JavaScript can read or copy it, which is exactly
the property a long-lived credential needs.

## Revoking one

A refresh token is just a signed token, so on its own the server can't tell a legitimate one
from a stolen one, and can't make one specific token stop working before it expires. Logging
out has to mean more than deleting the cookie on the client, since the token itself is still
valid until it expires on its own.

A simple fix is a version number stored per account. Every refresh token carries the version
that was current when it was issued. Logging out, or changing a password, bumps the stored
version by one. The next time that old token shows up at `/refresh`, its version no longer
matches, and the server rejects it. One number, checked on every refresh, turns a logout into
something permanent instead of cosmetic.
