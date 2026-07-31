# REST Conventions

REST is a set of conventions for naming API endpoints. Following them means another developer
can guess your API without reading documentation.

## The core idea

The path names a thing. The HTTP method says what to do with it. The verb never goes in the
path.

```
GET    /items       list them
POST   /items       create one
GET    /items/:id   read one
PUT    /items/:id   replace one
PATCH  /items/:id   change part of one
DELETE /items/:id   remove one
```

## Naming

Use nouns, not verbs. The method is already the verb.

| Instead of         | Use                 |
| ------------------ | ------------------- |
| `GET /getItems`    | `GET /items`        |
| `POST /createItem` | `POST /items`       |
| `POST /deleteItem` | `DELETE /items/:id` |
| `POST /updateItem` | `PUT /items/:id`    |

Use plural collection names. `/items` and `/items/42` read consistently, where `/item` and
`/item/42` do not.

Use lowercase with hyphens for multi-word paths: `/order-items`, not `/orderItems`.

## Nesting

Nest when a resource only makes sense inside its parent:

```
GET /users/:userId/posts     posts belonging to one user
```

Stop at one level. `/users/1/posts/2/comments/3` is hard to read and hard to maintain. Once
you have an id, address the thing directly: `/comments/3`.

## PUT vs PATCH

PUT replaces the whole resource. Every field is expected in the body, and anything left out
should be treated as cleared.

PATCH changes only the fields sent. Anything not mentioned keeps its current value.

```
PUT   /items/42   { "name": "New", "role": "Admin" }   both fields required
PATCH /items/42   { "name": "New" }                     role stays as it was
```

Both are common. PUT is simpler to implement. PATCH is friendlier to clients
that only want to change one field.

## Filtering and paging

These are not separate endpoints. They are query strings on the collection:

```
GET /items?role=admin
GET /items?page=2&limit=20
GET /items?sort=name
```

Adding `/itemsByRole` for every filter is what query strings exist to avoid.

## Consistency matters more than perfection

Plenty of real APIs bend these rules. The important part is that one API bends them the same
way everywhere, so that once someone learns one endpoint they can predict the rest.
