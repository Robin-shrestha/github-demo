# Authentication vs Authorization

Authentication answers "who is this". A login route handles it: checking a username and
password, or verifying a token, to confirm someone is who they claim to be.

Authorization answers "what is this person allowed to do". A protected route or a role check
handles it: confirming an identity is already known, then deciding whether that identity can
do the specific thing being requested.

The two get shortened to the same word, "auth", and are constantly mixed up, but a request can
fail either one independently:

```
No token at all, or an invalid one       -> 401 Unauthorized (authentication failed)
A valid token, but the wrong permissions -> 403 Forbidden (authorization failed)
```

A logged-in user trying to delete another user's post is authenticated (the server knows who
they are) but not authorized (they aren't allowed to do this). A request with no token at all
never gets far enough to be checked for permissions, since there's no identity yet to check.

## A hotel key card

Checking in at the front desk is authentication: showing an ID, getting a card issued to that
one guest. The card working in the elevator, but only up to that guest's own floor, and opening
only their own room, is authorization. Proving who someone is doesn't grant access to every
door in the building, only the ones that specific person is allowed through.

## In code

These usually show up as two separate pieces of middleware, stacked in a fixed order:

```js
router.delete("/posts/:id", authenticate, authorize("admin"), deleteHandler);
```

`authenticate` reads a token and figures out who is making the request. With no valid token,
it stops right there with a 401. There's no identity yet, so there's nothing to check
permissions for.

`authorize("admin")` only runs once authentication already succeeded. It looks at the identity
`authenticate` attached to the request and decides whether that identity can do this specific
thing. If not, a 403.

The order can't be swapped. Checking permissions before knowing who's asking has nothing to
check them against.
